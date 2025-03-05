"""
Default Imports
"""
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import warnings

"""
Custom Imports
"""
from config import settings
from instance import secrets
from services.prima_pizza.routes.toppings import toppings_bp
from services.prima_pizza.routes.pizzas import pizzas_bp
from services.prima_pizza.routes.auth import auth_bp


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = secrets.JWT_SECRET_KEY
    jwt = JWTManager(app)

    CORS(
        app,
        origins="*",
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    warnings.filterwarnings("ignore")

    app.config.from_pyfile("instance/secrets.py", silent=True)
    app.logger.setLevel(secrets.LOG_LEVEL)
    app.register_blueprint(toppings_bp)
    app.register_blueprint(pizzas_bp)
    app.register_blueprint(auth_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=settings.LAYER_PORT, debug=secrets.DEBUG)
