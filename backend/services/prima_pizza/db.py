"""
Default Imports
"""
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import ssl

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
    ssl_cert_reqs=ssl.CERT_NONE,
)

db = client.get_database()


def get_users_collection():
    return db.get_collection("users")


def get_pizzas_collection():
    return db.get_collection("pizzas")


def get_toppings_collection():
    return db.get_collection("toppings")


users_collection = get_users_collection()
pizzas_collection = get_pizzas_collection()
toppings_collection = get_toppings_collection()
