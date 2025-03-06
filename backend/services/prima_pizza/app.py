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

current_env = os.getenv("ENV", "LOCAL")

if current_env == "LOCAL":
    CLIENT_APP = "http://localhost:3000"
    PORT = 5005
else:
    CLIENT_APP = os.getenv("NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV", "")
    PORT = 8000


def create_app():
    app = Flask(__name__)

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
    )

    jwt = JWTManager(app)

    CORS(app, supports_credentials=True, origins=CLIENT_APP)

    app.register_blueprint(auth_bp)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)

    @app.errorhandler(Exception)
    def handle_exception(e):
        response = jsonify({"message": str(e)})
        response.status_code = 500
        return response

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=secrets.DEBUG)
