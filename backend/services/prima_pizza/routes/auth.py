"""
Default Imports
"""
import json
import logging
from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import base64
import os

"""
Custom Imports
"""
from services.prima_pizza.db import users_collection

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def hash_password(password):
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend(),
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return (salt, key)


def verify_password(stored_password, provided_password, salt):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend(),
    )
    key = base64.urlsafe_b64encode(kdf.derive(provided_password.encode()))
    return key == stored_password


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        logger.info(f"Register request data: {data}")
        if users_collection.find_one({"username": data["username"]}):
            return jsonify({"message": "User already exists"}), 400

        salt, hashed_password = hash_password(data["password"])
        user = {
            "username": data["username"],
            "password_hash": hashed_password,
            "salt": salt,
            "role": data["role"],
        }

        users_collection.insert_one(user)
        logger.info(f"User registered successfully: {user}")
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        logger.error(f"Error in register: {e}", exc_info=True)
        return jsonify({"message": "Error registering user"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        logger.info(f"Request headers: {request.headers}")
        logger.info(f"Content type: {request.content_type}")
        logger.info(f"Raw data: {request.get_data()}")
        
        if request.is_json:
            data = request.get_json()
        else:
            try:
                data = json.loads(request.get_data().decode('utf-8'))
            except:
                logger.error("Failed to parse JSON manually")
                return jsonify({"message": "Invalid JSON format"}), 400
                
        logger.info(f"Parsed data: {data}")
        
        logger.info(f"Login request data: {data}")
        logger.info(f"Request headers: {request.headers}")

        if not data:
            logger.error("No JSON data in request")
            return jsonify({"message": "Missing request data"}), 400

        if "username" not in data or "password" not in data:
            logger.error("Missing username or password in request")
            return jsonify({"message": "Username and password required"}), 400

        user = users_collection.find_one({"username": data["username"]})

        if not user or not verify_password(
            user["password_hash"], data["password"], user["salt"]
        ):
            return jsonify({"message": "Invalid credentials"}), 401

        identity = json.dumps({"username": user["username"], "role": user["role"]})
        access_token = create_access_token(
            identity=identity, expires_delta=timedelta(hours=3)
        )
        
        return jsonify(access_token=access_token), 200
    except Exception as e:
        logger.error(f"Error in login: {e}", exc_info=True)
        return jsonify({"message": f"Error logging in: {str(e)}"}), 500


@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        users = list(
            users_collection.find({}, {"_id": 0, "password_hash": 0, "salt": 0})
        )
        return jsonify(users), 200
    except Exception as e:
        logger.error(f"Error in get_users: {e}", exc_info=True)
        return jsonify({"message": "Error fetching users"}), 500
