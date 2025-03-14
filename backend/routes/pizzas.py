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
from db import get_pizzas_collection, get_toppings_collection
from models import Pizza
from utils.db import all_variations
from utils.auth import check_role
from config import settings

logger = logging.getLogger(__name__)

pizzas_collection = get_pizzas_collection()
toppings_collection = get_toppings_collection()

pizzas_bp = Blueprint("pizzas", __name__, url_prefix="/api/v1/pizzas")


@pizzas_bp.route("/", methods=["GET"])
def get_pizzas():
    try:
        pizzas = list(pizzas_collection.find({}, {"_id": 0}))
        return jsonify(pizzas), 200
    except Exception as e:
        logger.error(f"Error fetching pizzas: {e}")
        return jsonify({"message": "Error fetching pizzas"}), 500


@pizzas_bp.route("/", methods=["POST"])
@jwt_required()
def add_pizza():
    auth_error = check_role(["chef"])
    if auth_error:
        return auth_error

    data = request.get_json()

    try:
        pizza = Pizza(**data)
    except Exception as e:
        return jsonify({"message": f"Invalid data: {str(e)}"}), 400

    if pizzas_collection.find_one({"name": all_variations(pizza.name)}):
        return jsonify({"message": "Pizza already exists"}), 400

    ingredient_names = pizza.toppings + [pizza.crust, pizza.sauce, pizza.cheese]
    ingredients = {
        i["name"]: i
        for i in toppings_collection.find({"name": {"$in": ingredient_names}})
    }

    missing_ingredients = [i for i in ingredient_names if i not in ingredients]

    if missing_ingredients:
        return (
            jsonify(
                {
                    "message": f"Ingredients {', '.join(missing_ingredients)} do not exist"
                }
            ),
            400,
        )

    invalid_toppings = [
        t
        for t in pizza.toppings
        if ingredients[t]["topping_type"] in ["crust", "sauce"]
    ]
    if invalid_toppings:
        return (
            jsonify({"message": f"Toppings {', '.join(invalid_toppings)} are invalid"}),
            400,
        )

    base_price = sum(ingredients[i]["price"] for i in ingredient_names)

    def round_up(price):
        return math.ceil(price) - 0.01

    price = {
        "s": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["s"]),
        "m": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["m"]),
        "l": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["l"]),
    }

    pizza_data = pizza.model_dump()
    pizza_data["price"] = price

    try:
        pizzas_collection.insert_one(pizza_data)
        return jsonify({"message": f"Pizza {pizza.name} added"}), 201
    except Exception as e:
        logger.error(f"Error adding pizza: {e}")
        return jsonify({"message": "Error adding pizza"}), 500


@pizzas_bp.route("/<string:name>", methods=["DELETE"])
@jwt_required()
def delete_pizza(name):
    auth_error = check_role(["chef"])
    if auth_error:
        return auth_error

    try:
        result = pizzas_collection.delete_one({"name": all_variations(name)})
        if result.deleted_count == 0:
            return jsonify({"message": f"Pizza {name} not found"}), 404

        return jsonify({"message": f"Pizza {name} deleted"}), 200
    except Exception as e:
        logger.error(f"Error deleting pizza: {e}")
        return jsonify({"message": "Error deleting pizza"}), 500


@pizzas_bp.route("/<string:name>", methods=["PUT"])
@jwt_required()
def update_pizza(name):
    auth_error = check_role(["chef"])
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
    if "toppings" in data:
        update_fields["toppings"] = data["toppings"]
    if "crust" in data:
        update_fields["crust"] = data["crust"]
    if "sauce" in data:
        update_fields["sauce"] = data["sauce"]
    if "cheese" in data:
        update_fields["cheese"] = data["cheese"]

    update_fields["date_added"] = datetime.utcnow()

    if not update_fields:
        return jsonify({"message": "No valid fields provided for update"}), 400

    if check_new_name:
        existing_pizza = pizzas_collection.find_one(
            {"name": all_variations(data["name"])}
        )

        if existing_pizza:
            return jsonify({"message": "Pizza already exists with that name"}), 400

    if "toppings" in data or "crust" in data or "sauce" in data or "cheese" in data:
        ingredient_names = data.get("toppings", []) + [
            data.get("crust"),
            data.get("sauce"),
            data.get("cheese"),
        ]
        ingredients = {
            i["name"]: i
            for i in toppings_collection.find({"name": {"$in": ingredient_names}})
        }

        missing_ingredients = [i for i in ingredient_names if i not in ingredients]

        if missing_ingredients:
            return (
                jsonify(
                    {
                        "message": f"Ingredients {', '.join(missing_ingredients)} do not exist"
                    }
                ),
                400,
            )

        invalid_toppings = [
            t
            for t in data.get("toppings", [])
            if ingredients[t]["topping_type"] in ["crust", "sauce"]
        ]
        if invalid_toppings:
            return (
                jsonify(
                    {"message": f"Toppings {', '.join(invalid_toppings)} are invalid"}
                ),
                400,
            )

        base_price = sum(ingredients[i]["price"] for i in ingredient_names)

        def round_up(price):
            return math.ceil(price) - 0.01

        price = {
            "s": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["s"]),
            "m": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["m"]),
            "l": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["l"]),
        }

        update_fields["price"] = price

    try:
        result = pizzas_collection.update_one(
            {"name": all_variations(name)}, {"$set": update_fields}
        )
        return jsonify({"message": f"Pizza {name} updated successfully"}), 200
    except Exception as e:
        logger.error(f"Error updating pizza: {e}")
        return jsonify({"message": "Error updating pizza"}), 500


@pizzas_bp.route("/", methods=["OPTIONS"])
@pizzas_bp.route("/<string:name>", methods=["OPTIONS"])
def handle_options():
    response = jsonify({"message": "OK"})
    return response, 200
