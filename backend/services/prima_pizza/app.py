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
        origins=[
            "https://prima-pizza.vercel.app",
            "http://localhost:3000",
            "https://localhost:3000",
            "https://prima-pizza-git-prod-davazquezs-projects.vercel.app",
        ],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
    )

    warnings.filterwarnings("ignore")
    app.config.from_pyfile("instance/secrets.py", silent=True)
    app.logger.setLevel(secrets.LOG_LEVEL)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(auth_bp)

    @app.before_request
    def redirect_to_https():
        if (
            not request.is_secure
            and request.environ.get("HTTP_X_FORWARDED_PROTO", "http") == "http"
        ):
            url = request.url.replace("http://", "https://", 1)
            return redirect(url, code=301)

    @app.before_request
    def log_request_info():
        app.logger.debug("Headers: %s", request.headers)
        app.logger.debug("Body: %s", request.get_data())

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=secrets.DEBUG,
    )
