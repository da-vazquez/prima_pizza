"""
Default Imports
"""
from pymongo import MongoClient

"""
Custom Imports
"""
from instance import secrets

client = MongoClient(secrets.DATABASE_URL)
db = client["prima_pizza"]

toppings_collection = db.toppings
pizzas_collection = db.pizzas
