"""
Default Imports
"""
from flask import Blueprint, request, jsonify
import math

"""
Custom Imports
"""
from services.prima_pizza.db import pizzas_collection, toppings_collection
from services.prima_pizza.models import Pizza
from utils.db import all_variations
from config import settings

pizzas_bp = Blueprint("pizzas", __name__, url_prefix="/api/v1/pizzas")


@pizzas_bp.route("/", methods=["GET"])
def get_pizzas():
    pizzas = list(pizzas_collection.find({}, {"_id": 0}))
    return jsonify(pizzas), 200


@pizzas_bp.route("/", methods=["POST"])
def add_pizza():
    data = request.get_json()
    pizza = Pizza(**data)
    crust, sauce, cheese = pizza.crust, pizza.sauce, pizza.cheese

    if pizzas_collection.find_one({"name": all_variations(pizza.name)}):
        return jsonify({"message": "Pizza already exists"}), 400

    ingredient_names = pizza.toppings + [crust, sauce, cheese]
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

    base_price = sum(
        ingredients[i]["price"] for i in pizza.toppings + [crust, sauce, cheese]
    )

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
    return jsonify({"message": "Pizza added", "price": price}), 201


@pizzas_bp.route("/<string:name>", methods=["DELETE"])
def delete_pizza(name):
    result = pizzas_collection.delete_one({"name": all_variations(name)})

    if result.deleted_count == 0:
        return jsonify({"message": "Pizza not found"}), 404
    return jsonify({"message": "Pizza deleted"}), 200
