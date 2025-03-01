"""
Default Imports
"""
import json
from datetime import timedelta
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

"""
Custom Imports
"""
from services.prima_pizza.db import users_collection

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if users_collection.find_one({"username": data["username"]}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    user = {
        "username": data["username"],
        "password_hash": hashed_password,
        "role": data["role"],
    }

    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = users_collection.find_one({"username": data["username"]})

    if not user or not check_password_hash(user["password_hash"], data["password"]):
        return (
            jsonify({"message": "Invalid credentials or account does not exist"}),
            401,
        )

    identity = json.dumps({"username": user["username"], "role": user["role"]})
    access_token = create_access_token(
        identity=identity, expires_delta=timedelta(hours=3)
    )

    return jsonify(access_token=access_token), 200


@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    users = users_collection.find({}, {"password_hash": 0})
    users_list = [{**user, "_id": str(user["_id"])} for user in users]
    return jsonify(users_list), 200


@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = json.loads(get_jwt_identity())
    return jsonify(logged_in_as=current_user), 200
