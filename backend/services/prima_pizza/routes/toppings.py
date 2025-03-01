"""
Default Imports
"""
from flask import Blueprint, request, jsonify

"""
Custom Imports
"""
from services.prima_pizza.db import toppings_collection
from services.prima_pizza.models import Topping
from utils.db import all_variations

toppings_bp = Blueprint("toppings", __name__, url_prefix="/api/v1/toppings")


@toppings_bp.route("/", methods=["GET"])
def get_toppings():
    toppings = list(toppings_collection.find({}, {"_id": 0}))
    return jsonify(toppings), 200


@toppings_bp.route("/", methods=["POST"])
def add_topping():
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
def delete_topping(name):
    result = toppings_collection.delete_one({"name": all_variations(name)})

    if result.deleted_count == 0:
        return jsonify({"message": f"Topping {name} not found"}), 404

    return jsonify({"message": f"Topping {name} deleted"}), 200
