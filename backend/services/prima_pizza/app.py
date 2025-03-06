"""
Default Imports
"""
import logging
from datetime import timedelta
from flask import Flask, request, redirect, jsonify
from flask_jwt_extended import JWTManager
import warnings
import os
from dotenv import load_dotenv
from flask_cors import CORS

"""
Logging
"""
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
Custom Imports
"""
from config import settings
from instance import secrets
from services.prima_pizza.routes.toppings import toppings_bp
from services.prima_pizza.routes.pizzas import pizzas_bp
from services.prima_pizza.routes.auth import auth_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
    )

    jwt = JWTManager(app)

    CORS(app, supports_credentials=True, origins="*")

    app.register_blueprint(auth_bp)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)

    @app.errorhandler(Exception)
    def handle_error(error):
        logger.error(f"Unhandled error: {error}", exc_info=True)
        response = jsonify({"message": "Internal server error"})
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=secrets.DEBUG)
