"""
Default Imports
"""
import logging
from flask import Flask, request, redirect
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

    allowed_origins = [
        "https://prima-pizza.vercel.app",
        "https://prima-pizza-backend-west.azurewebsites.net",
        "https://localhost:3000",
    ]

    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins, "supports_credentials": True}},
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
        if origin in allowed_origins:
            response.headers.add("Access-Control-Allow-Origin", origin)
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    @app.before_request
    def force_https():
        if request.url.startswith("http://"):
            url = request.url.replace("http://", "https://", 1)
            return redirect(url, code=302)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=secrets.DEBUG,
    )
