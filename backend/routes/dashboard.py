"""
Default Imports
"""
import logging
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

"""
Custom Imports
"""
from db import db

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/v1/dashboard")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dashboard_bp.route("/pizza_topping_count", methods=["GET"])
def get_pizza_topping_count():
    """Get counts of pizzas and toppings for dashboard"""
    try:
        pizzas = db.pizzas.count_documents({})
        toppings = db.toppings.count_documents({})
        meats = db.toppings.count_documents({"topping_type": "meat"})
        cheeses = db.toppings.count_documents({"topping_type": "cheese"})
        vegetables = db.toppings.count_documents({"topping_type": "vegetable"})
        sauces = db.toppings.count_documents({"topping_type": "sauce"})
        crusts = db.toppings.count_documents({"topping_type": "crust"})

        logger.info("Queries executed successfully")

        return (
            jsonify(
                {
                    "pizzas": pizzas,
                    "toppings": toppings,
                    "meats": meats,
                    "cheeses": cheeses,
                    "vegetables": vegetables,
                    "sauces": sauces,
                    "crusts": crusts,
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"MongoDB Error details: {e}", exc_info=True)
        return (
            jsonify(
                {"error": "Error fetching pizza and topping data", "details": str(e)}
            ),
            500,
        )
