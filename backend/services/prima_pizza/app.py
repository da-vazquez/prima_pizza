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

    CORS(
        app,
        origins=["*"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=False,
    )

    warnings.filterwarnings("ignore")
    app.config.from_pyfile("instance/secrets.py", silent=True)
    app.logger.setLevel(secrets.LOG_LEVEL)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(auth_bp)

    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    @app.before_request
    def force_https():
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 302
            return redirect(url, code=code)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=secrets.DEBUG,
    )
