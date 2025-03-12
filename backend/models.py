"""
Default Imports
"""
import logging
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Topping(BaseModel):
    name: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    topping_type: str = Field(..., min_length=1)
    date_added: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={
            "example": {"name": "Pepperoni", "price": 1.50, "topping_type": "meat"}
        },
    )

    def __init__(self, **data):
        super().__init__(**data)
        object.__setattr__(self, "logger", logger)

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        if "date_added" in data and isinstance(data["date_added"], datetime):
            data["date_added"] = data["date_added"].isoformat()
        return data


class Pizza(BaseModel):
    name: str = Field(..., min_length=1)
    toppings: List[str] = Field(..., min_length=1)
    crust: str = Field(..., min_length=1)
    sauce: str = Field(..., min_length=1)
    cheese: str = Field(..., min_length=1)
    price: Dict[str, float] = Field(default_factory=dict)
    date_added: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={"example": {"name": "Margherita", "toppings": ["Basil"]}},
    )

    def __init__(self, **data):
        super().__init__(**data)
        object.__setattr__(self, "logger", logger)

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        if "date_added" in data and isinstance(data["date_added"], datetime):
            data["date_added"] = data["date_added"].isoformat()
        return data


class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password_hash: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)

    model_config = ConfigDict(
        extra="ignore",
        json_schema_extra={"example": {"username": "john_doe", "role": "chef"}},
    )

    def __init__(self, **data):
        super().__init__(**data)
        object.__setattr__(self, "logger", logger)
