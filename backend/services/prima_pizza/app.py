"""
Default Imports
"""
import logging
from datetime import timedelta
from flask import Flask, request, jsonify, make_response
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
    CLIENT_APP = "https://white-forest-0d702341e.6.azurestaticapps.net"
    PORT = 8000


def create_app():
    app = Flask(__name__)

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
        ENV=current_env,
    )

    jwt = JWTManager(app)

    if current_env == "LOCAL":
        CORS(
            app,
            resources={
                r"/api/*": {
                    # "origins": ["http://localhost:3000"],
                    "origins": ["*"],
                    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                    "allow_headers": [
                        "Content-Type",
                        "Authorization",
                        "Accept",
                        "Origin",
                        "X-Requested-With",
                    ],
                    "expose_headers": ["Content-Type", "Authorization"],
                    "supports_credentials": False,
                }
            },
        )
    else:
        CORS(
            app,
            resources={
                r"/api/*": {
                    # "origins": [CLIENT_APP],
                    "origins": ["*"],
                    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                    "allow_headers": [
                        "Content-Type",
                        "Authorization",
                        "Accept",
                        "Origin",
                        "X-Requested-With",
                    ],
                    "expose_headers": ["Content-Type", "Authorization"],
                    "supports_credentials": False,
                    "max_age": 3600,
                }
            },
        )

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = make_response()
            # response.headers["Access-Control-Allow-Origin"] = CLIENT_APP
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers[
                "Access-Control-Allow-Methods"
            ] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers[
                "Access-Control-Allow-Headers"
            ] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
            response.headers["Access-Control-Max-Age"] = "3600"
            return response

    @app.after_request
    def add_cors_headers(response):
        # response.headers['Access-Control-Allow-Origin'] = CLIENT_APP
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    @app.route("/api/<path:path>", methods=["OPTIONS"])
    def handle_options_api(path):
        response = make_response()
        # response.headers['Access-Control-Allow-Origin'] = CLIENT_APP
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers[
            "Access-Control-Allow-Methods"
        ] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers[
            "Access-Control-Allow-Headers"
        ] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
        response.headers["Access-Control-Max-Age"] = "3600"
        return response

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
