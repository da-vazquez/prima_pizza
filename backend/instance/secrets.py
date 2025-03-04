"""
Default Imports
"""
import os
import dotenv

"""
Custom Imports
"""
from config import settings

ENV = os.getenv("ENV", "")

if ENV not in settings.ENV_OPTIONS:
    raise ValueError(f"ENV must be one of {settings.ENV_OPTIONS}")

dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), f"{ENV.lower()}.env"))

"""
Debug and logging
"""
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")

print(f"DEBUG: {DEBUG}")
print(f"LOG_LEVEL: {LOG_LEVEL}")
print(f"MESSAGE: {settings.ENV_WARNING[ENV]}")


"""
MongoDB 
"""
DATABASE_URL = os.getenv("DATABASE_URL", "")
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "")

"""
Auth
"""
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
