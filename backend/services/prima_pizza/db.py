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

database_url = (
    os.getenv("TEST_DATABASE_URL")
    if os.getenv("ENV") == "TEST"
    else os.getenv("DATABASE_URL")
)

client = MongoClient(database_url)
db = client["prima_pizza"]

if os.getenv("ENV") == "TEST":
    toppings_collection = db.test_toppings
    pizzas_collection = db.test_pizzas
    users_collection = db.test_users
else:
    toppings_collection = db.toppings
    pizzas_collection = db.pizzas
    users_collection = db.users
