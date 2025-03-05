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

client = MongoClient(DATABASE_URL, tls=True, tlsAllowInvalidCertificates=True)

db = client.get_database()

users_collection = db.get_collection("users")
