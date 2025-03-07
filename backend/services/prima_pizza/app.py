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
from services.prima_pizza.routes.dashboard import dashboard_bp

load_dotenv()

current_env = os.getenv("ENV", "LOCAL")

if current_env == "LOCAL":
    CLIENT_APP = "http://localhost:3000"
    PORT = 5005
else:
    CLIENT_APP = "*"
    PORT = 8000


def create_app():
    app = Flask(__name__)

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
    )

    jwt = JWTManager(app)

    if current_env == "LOCAL":
        # Local config stays the same
        CORS(
            app,
            origins=["http://localhost:3000"],
            supports_credentials=False,
            allow_headers=[
                "Content-Type",
                "Authorization",
                "Accept",
                "Origin",
                "X-Requested-With",
            ],
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            expose_headers=["Content-Type", "Authorization"],
        )
    else:
        CORS(
            app,
            origins=["https://mango-meadow-0d2cf901e.6.azurestaticapps.net"],
            supports_credentials=False,
            allow_headers=[
                "Content-Type",
                "Authorization",
                "Accept",
                "Origin",
                "X-Requested-With",
            ],
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            expose_headers=["Content-Type", "Authorization"],
        )

    app.register_blueprint(auth_bp)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(dashboard_bp)

    # Add consistent CORS headers to all responses
    @app.after_request
    def add_cors_headers(response):
        if current_env == "LOCAL":
            response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers[
                "Access-Control-Allow-Methods"
            ] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers[
                "Access-Control-Allow-Headers"
            ] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
        else:
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers[
                "Access-Control-Allow-Methods"
            ] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers[
                "Access-Control-Allow-Headers"
            ] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
        return response

    # Add explicit OPTIONS handler for preflight requests
    @app.route("/", defaults={"path": ""}, methods=["OPTIONS"])
    @app.route("/<path:path>", methods=["OPTIONS"])
    def handle_options(path):
        response = app.make_default_options_response()
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        response = jsonify({"message": str(e)})
        response.status_code = 500
        return response

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
