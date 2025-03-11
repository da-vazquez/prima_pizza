"""
Default Imports
"""
import logging
import sys
from datetime import timedelta
from flask import Flask, request, jsonify, make_response
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from flask_cors import CORS

"""
Logging
"""
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

"""
Custom Imports
"""
from config import settings
from instance import secrets
from routes.toppings import toppings_bp
from routes.pizzas import pizzas_bp
from routes.auth import auth_bp
from routes.dashboard import dashboard_bp

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
    logger.info("Creating Flask application")
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"PYTHONPATH: {os.environ.get('PYTHONPATH')}")
    logger.info(f"ENV: {os.environ.get('ENV')}")
    logger.info(f"PORT: {os.environ.get('PORT')}")
    logger.info(f"Directory contents: {os.listdir()}")

    app.config.update(
        JWT_SECRET_KEY=secrets.JWT_SECRET_KEY,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=3),
        ENV=current_env,
    )

    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=False,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With",
        ],
    )

    jwt = JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(dashboard_bp)

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        response = jsonify({"message": str(e)})
        response.status_code = 500
        return response

    return app


app = create_app()

if __name__ == "__main__":
    debug_mode = True if current_env == "LOCAL" else False
    app.run(host="0.0.0.0", port=PORT, debug=debug_mode)
