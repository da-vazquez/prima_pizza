"""
Default Imports
"""
from pymongo import MongoClient
import os
from dotenv import load_dotenv

"""
Custom Imports
"""
from instance import secrets

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

client = MongoClient(
    DATABASE_URL,
    tls=True,
    tlsAllowInvalidCertificates=True,
)

db = client.get_database()


def get_users_collection():
    return db.get_collection("users")


def get_pizzas_collection():
    return db.get_collection("pizzas")


def get_toppings_collection():
    return db.get_collection("toppings")


def get_test_users_collection():
    return db.get_collection("test_users")


def get_test_toppings_collection():
    return db.get_collection("test_toppings")


def get_test_pizzas_collection():
    return db.get_collection("test_pizzas")


# Collections
users_collection = get_users_collection()
pizzas_collection = get_pizzas_collection()
toppings_collection = get_toppings_collection()

# Testing collections
test_users_collection = get_test_users_collection()
test_toppings_collection = get_test_toppings_collection()
test_pizzas_collection = get_test_pizzas_collection()
