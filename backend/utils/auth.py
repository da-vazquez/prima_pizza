"""
Default Imports
"""
import json
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

"""
Custom Imports
"""
from services.prima_pizza.db import users_collection


def check_role(required_roles):
    current_identity = get_jwt_identity()

    if isinstance(current_identity, str):
        current_identity = json.loads(current_identity)

    username = current_identity.get("username")
    role = current_identity.get("role")

    if role not in required_roles:
        return jsonify({"message": "Unauthorized"}), 403

    return None
