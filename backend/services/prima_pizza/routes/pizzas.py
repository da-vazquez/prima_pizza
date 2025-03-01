"""
Default Imports
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import math

"""
Custom Imports
"""
from services.prima_pizza.db import pizzas_collection, toppings_collection
from services.prima_pizza.models import Pizza
from utils.db import all_variations
from utils.auth import check_role
from config import settings

pizzas_bp = Blueprint("pizzas", __name__, url_prefix="/api/v1/pizzas")


@pizzas_bp.route("/", methods=["GET"])
def get_pizzas():
    pizzas = list(pizzas_collection.find({}, {"_id": 0}))
    return jsonify(pizzas), 200


@pizzas_bp.route("/", methods=["POST"])
@jwt_required()
def add_pizza():
    auth_error = check_role(["chef"])
    if auth_error:
        return auth_error

    data = request.get_json()
    pizza = Pizza(**data)

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
        return jsonify(
            {"message": f"Toppings {', '.join(invalid_toppings)} are invalid"}, 400
        )

    base_price = sum(ingredients[i]["price"] for i in ingredient_names)

    def round_up(price):
        return math.ceil(price) - 0.01

    price = {
        "s": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["s"]),
        "m": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["m"]),
        "l": round_up(base_price * settings.PIZZA_SIZE_SURCHARGE["l"]),
    }

    pizza_data = pizza.dict()
    pizza_data["price"] = price

    pizzas_collection.insert_one(pizza_data)
    return jsonify({"message": f"Pizza {pizza.name} added"}), 201


@pizzas_bp.route("/<string:name>", methods=["DELETE"])
@jwt_required()
def delete_pizza(name):
    auth_error = check_role(["chef"])
    if auth_error:
        return auth_error

    result = pizzas_collection.delete_one({"name": all_variations(name)})
    if result.deleted_count == 0:
        return jsonify({"message": "Pizza not found"}), 404

    return jsonify({"message": f"Pizza {name} deleted"}), 200
