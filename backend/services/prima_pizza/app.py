"""
Default Imports
"""
import logging
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import warnings
import os
from dotenv import load_dotenv

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
    app.config["JWT_SECRET_KEY"] = secrets.JWT_SECRET_KEY
    jwt = JWTManager(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "https://prima-pizza.vercel.app",
                    "https://prima-pizza-backend-west.azurewebsites.net",
                    "https://localhost:3000",
                ],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                    "Accept",
                    "Origin",
                    "X-Requested-With",
                ],
                "expose_headers": ["Content-Range", "X-Content-Range"],
                "supports_credentials": True,
                "send_wildcard": False,
                "max_age": 600,
            }
        },
    )

    warnings.filterwarnings("ignore")
    app.config.from_pyfile("instance/secrets.py", silent=True)
    app.logger.setLevel(secrets.LOG_LEVEL)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(auth_bp)

    @app.after_request
    def after_request(response):
        origin = request.headers.get("Origin")
        if origin in app.config["CORS_ORIGINS"]:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers[
                "Access-Control-Allow-Methods"
            ] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers[
                "Access-Control-Allow-Headers"
            ] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
            response.headers[
                "Access-Control-Expose-Headers"
            ] = "Content-Range, X-Content-Range"
        return response

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=secrets.DEBUG,
    )
