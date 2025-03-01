"""
Default Imports
"""
from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime


class Topping(BaseModel):
    name: str = Field(..., required=True)
    price: float = Field(..., required=True)
    topping_type: str = Field(..., required=True)
    date_added: datetime = Field(default_factory=datetime.utcnow, required=True)

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class Pizza(BaseModel):
    name: str = Field(..., min_length=1)
    toppings: List[str] = Field(..., min_items=1)
    crust: str = Field(..., min_length=1)
    sauce: str = Field(..., min_length=1)
    cheese: str = Field(..., min_length=1)
    price: Dict[str, float] = Field(default_factory=dict)
    date_added: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
