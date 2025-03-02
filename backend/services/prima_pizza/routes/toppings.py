"""
Default Imports
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from datetime import datetime

"""
Custom Imports
"""
from services.prima_pizza.db import toppings_collection
from services.prima_pizza.models import Topping
from utils.db import all_variations
from utils.auth import check_role

toppings_bp = Blueprint("toppings", __name__, url_prefix="/api/v1/toppings")


@toppings_bp.route("/", methods=["GET"])
def get_toppings():
    toppings = list(toppings_collection.find({}, {"_id": 0}))
    return jsonify(toppings), 200


@toppings_bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"])
def add_topping():
    auth_error = check_role(["owner"])
    if auth_error:
        return auth_error

    data = request.get_json()
    topping = Topping(**data)

    existing_topping = toppings_collection.find_one(
        {"name": all_variations(topping.name)}
    )

    if existing_topping:
        return jsonify({"message": "Topping already exists"}), 400

    toppings_collection.insert_one(topping.dict())
    return jsonify({"message": "Topping added"}), 201


@toppings_bp.route("/<string:name>", methods=["DELETE"])
@jwt_required()
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"])
def delete_topping(name):
    auth_error = check_role(["owner"])
    if auth_error:
        return auth_error

    result = toppings_collection.delete_one({"name": all_variations(name)})
    if result.deleted_count == 0:
        return jsonify({"message": f"Topping {name} not found"}), 404

    return jsonify({"message": f"Topping {name} deleted"}), 200


@toppings_bp.route("/<string:name>", methods=["PUT"])
@jwt_required()
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"])
def update_topping(name):
    auth_error = check_role(["owner"])
    if auth_error:
        return auth_error

    data = request.get_json()
    update_fields = {}
    check_new_name = False

    if "name" in data:
        update_fields["name"] = data["name"]
        check_new_name = True
    if "price" in data:
        update_fields["price"] = data["price"]
    if "topping_type" in data:
        update_fields["topping_type"] = data["topping_type"]

    update_fields["date_added"] = datetime.utcnow()

    if not update_fields:
        return jsonify({"message": "No valid fields provided for update"}), 400

    if check_new_name:
        existing_topping = toppings_collection.find_one(
            {"name": all_variations(data["name"])}
        )

        if existing_topping:
            return jsonify({"message": "Topping already exists with that name"}), 400

    result = toppings_collection.update_one(
        {"name": all_variations(name)}, {"$set": update_fields}
    )

    return jsonify({"message": f"Topping {name} updated successfully"}), 200
