"""
Default Imports
"""
import logging
from datetime import timedelta
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
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
    CLIENT_APP = "https://mango-meadow-0d2cf901e.6.azurestaticapps.net"
    PORT = 8000


def create_app():
    app = Flask(__name__)

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
        ENV=current_env,
    )

    jwt = JWTManager(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [CLIENT_APP],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "Accept"],
                "supports_credentials": True,
            }
        },
        expose_headers=["Content-Type", "Authorization"],
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(dashboard_bp)

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
    debug_mode = True if current_env == "LOCAL" else False
    app.run(host="0.0.0.0", port=PORT, debug=debug_mode)
