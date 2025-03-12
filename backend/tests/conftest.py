import sys
import os
import pytest
import warnings

warnings.filterwarnings(
    "ignore", category=DeprecationWarning, module="flask_jwt_extended"
)
warnings.filterwarnings("ignore", category=DeprecationWarning, module="bson")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="flask.testing")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="jwt")

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from app import create_app
from db import (
    test_pizzas_collection,
    test_toppings_collection,
    test_users_collection,
)
from instance import secrets


if os.getenv("ENV") != "TEST":
    pytest.exit(
        "Tests can only be run in the TEST environment. Please set the ENV environment variable to 'TEST'.",
        returncode=1,
    )

app = create_app()


@pytest.fixture(scope="function")
def test_client():
    app.config["TESTING"] = True
    app.config["MONGO_URI"] = secrets.TEST_DATABASE_URL

    with app.test_client() as testing_client:
        with app.app_context():
            yield testing_client


@pytest.fixture(scope="function")
def init_database():
    test_pizzas_collection.delete_many({})
    test_toppings_collection.delete_many({})
    test_users_collection.delete_many({})

    yield
    test_pizzas_collection.delete_many({})
    test_toppings_collection.delete_many({})
    test_users_collection.delete_many({})
