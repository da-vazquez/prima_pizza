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

    default_origins = [
        "https://prima-pizza.vercel.app",
        "https://prima-pizza-backend-west.azurewebsites.net",
        "https://localhost:3000",
    ]

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
        CORS_ORIGINS=os.getenv("CORS_ORIGINS", ",".join(default_origins)).split(","),
        CORS_SUPPORTS_CREDENTIALS=True,
    )

    jwt = JWTManager(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                    "Accept",
                    "Origin",
                    "X-Requested-With",
                ],
                "supports_credentials": True,
                "expose_headers": ["Authorization"],
            }
        },
    )

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)

    @app.after_request
    def after_request(response):
        try:
            origin = request.headers.get("Origin")
            allowed_origins = app.config.get("CORS_ORIGINS", default_origins)

            if origin and origin in allowed_origins:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers[
                    "Access-Control-Allow-Methods"
                ] = "GET, POST, PUT, DELETE, OPTIONS"
                response.headers[
                    "Access-Control-Allow-Headers"
                ] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
                response.headers["Access-Control-Expose-Headers"] = "Authorization"
        except Exception as e:
            app.logger.error(f"CORS header processing error: {str(e)}")

        return response

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=secrets.DEBUG)
