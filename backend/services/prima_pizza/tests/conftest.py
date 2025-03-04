import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from services.prima_pizza.app import create_app
from services.prima_pizza.db import (
    pizzas_collection,
    toppings_collection,
    users_collection,
)
from instance import secrets


if os.getenv("ENV") != "TEST":
    pytest.exit(
        "Tests can only be run in the TEST environment. Please set the ENV environment variable to 'TEST'.",
        returncode=1,
    )

app = create_app()


@pytest.fixture(scope="module")
def test_client():
    app.config["TESTING"] = True
    app.config["MONGO_URI"] = secrets.TEST_DATABASE_URL

    with app.test_client() as testing_client:
        with app.app_context():
            yield testing_client


@pytest.fixture(scope="module")
def init_database():
    pizzas_collection.delete_many({})
    toppings_collection.delete_many({})
    users_collection.delete_many({})

    yield
    pizzas_collection.delete_many({})
    toppings_collection.delete_many({})
    users_collection.delete_many({})
