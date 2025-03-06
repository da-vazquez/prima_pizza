"""
Default Imports
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
import math
import logging

"""
Custom Imports
"""
from services.prima_pizza.db import get_toppings_collection, get_pizzas_collection
from services.prima_pizza.models import Topping
from utils.db import all_variations
from utils.auth import check_role
from config import settings

toppings_collection = get_toppings_collection()
pizzas_collection = get_pizzas_collection()

toppings_bp = Blueprint("toppings", __name__, url_prefix="/api/v1/toppings")
logger = logging.getLogger(__name__)


@toppings_bp.route("/", methods=["GET"])
def get_toppings():
    try:
        toppings = list(toppings_collection.find({}, {"_id": 0}))
        response = jsonify(toppings)
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 200
    except Exception as e:
        logger.error(f"Error fetching toppings: {e}")
        response = jsonify({"message": "Error fetching toppings"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 500


@toppings_bp.route("/", methods=["POST"])
@jwt_required()
def add_topping():
    auth_error = check_role(["owner"])
    if auth_error:
        response = auth_error[0]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, auth_error[1]

    try:
        data = request.get_json()
        topping = Topping(**data)

        if toppings_collection.find_one({"name": all_variations(topping.name)}):
            response = jsonify({"message": "Topping already exists"})
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response, 400

        toppings_collection.insert_one(topping.model_dump())
        response = jsonify({"message": f"Topping {topping.name} added"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 201
    except Exception as e:
        logger.error(f"Error adding topping: {e}")
        response = jsonify({"message": "Error adding topping"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 500


@toppings_bp.route("/<string:name>", methods=["DELETE"])
@jwt_required()
def delete_topping(name):
    auth_error = check_role(["owner"])
    if auth_error:
        response = auth_error[0]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, auth_error[1]

    try:
        result = toppings_collection.delete_one({"name": all_variations(name)})
        if result.deleted_count == 0:
            response = jsonify({"message": f"Topping {name} not found"})
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response, 404

        pizzas = pizzas_collection.find({"toppings": name})
        for pizza in pizzas:
            updated_toppings = [t for t in pizza["toppings"] if t != name]
            ingredient_names = updated_toppings + [
                pizza["crust"],
                pizza["sauce"],
                pizza["cheese"],
            ]
            ingredients = {
                i["name"]: i
                for i in toppings_collection.find({"name": {"$in": ingredient_names}})
            }

            base_price = sum(ingredients[i]["price"] for i in ingredient_names)

            def round_up(price):
                return math.ceil(price) - 0.01

            price = {
                "s": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["s"]),
                "m": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["m"]),
                "l": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["l"]),
            }

            pizzas_collection.update_one(
                {"_id": pizza["_id"]},
                {"$set": {"toppings": updated_toppings, "price": price}},
            )

        response = jsonify({"message": f"Topping {name} deleted and pizzas updated"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 200
    except Exception as e:
        logger.error(f"Error deleting topping: {e}")
        response = jsonify({"message": "Error deleting topping"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 500


@toppings_bp.route("/<string:name>", methods=["PUT"])
@jwt_required()
def update_topping(name):
    auth_error = check_role(["owner"])
    if auth_error:
        response = auth_error[0]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, auth_error[1]

    try:
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
            response = jsonify({"message": "No valid fields provided for update"})
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response, 400

        if check_new_name:
            existing_topping = toppings_collection.find_one(
                {"name": all_variations(data["name"])}
            )
            if existing_topping:
                response = jsonify({"message": "Topping already exists with that name"})
                response.headers["Access-Control-Allow-Credentials"] = "true"
                return response, 400

        toppings_collection.update_one(
            {"name": all_variations(name)}, {"$set": update_fields}
        )

        response = jsonify({"message": f"Topping {name} updated successfully"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 200
    except Exception as e:
        logger.error(f"Error updating topping: {e}")
        response = jsonify({"message": "Error updating topping"})
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 500
