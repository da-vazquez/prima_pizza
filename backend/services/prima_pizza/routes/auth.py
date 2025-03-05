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

# Configure logging
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
        return jsonify({"message": "Internal Server Error"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        logger.info(f"Login request data: {data}")
        user = users_collection.find_one({"username": data["username"]})

        if not user or not verify_password(
            user["password_hash"], data["password"], user["salt"]
        ):
            return (
                jsonify({"message": "Invalid credentials or account does not exist"}),
                401,
            )

        identity = json.dumps({"username": user["username"], "role": user["role"]})
        access_token = create_access_token(
            identity=identity, expires_delta=timedelta(hours=3)
        )

        logger.info(f"User logged in successfully: {user['username']}")
        return jsonify(access_token=access_token), 200
    except Exception as e:
        logger.error(f"Error in login: {e}", exc_info=True)
        return jsonify({"message": "Internal Server Error"}), 500


@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        users = users_collection.find({}, {"password_hash": 0, "salt": 0})
        users_list = [{**user, "_id": str(user["_id"])} for user in users]
        logger.info(f"Users retrieved successfully: {users_list}")
        return jsonify(users_list), 200
    except Exception as e:
        logger.error(f"Error in get_users: {e}", exc_info=True)
        return jsonify({"message": "Internal Server Error"}), 500
