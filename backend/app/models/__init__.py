"""
This package contains all SQLModel-based database models.

Each model defined here represents a table in the database.
These classes use `SQLModel` with `table=True` to enable ORM mapping.
They are used for interacting with the database layer.

Example:
    from app.models.user import User

Note:
    Do not expose these models directly in your API responses.
    For that, use the corresponding Pydantic models in `app.schemas`.
"""