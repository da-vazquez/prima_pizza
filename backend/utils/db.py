"""
Default Imports
"""
import re


def all_variations(name):
    """
    Used to search db for entries with different casing: ex (uppercase, lowercase, titlecase..)
    """
    return re.compile(f"^{name}$", re.IGNORECASE)
