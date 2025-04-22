"""
This package contains all Pydantic models used for API data validation and serialization.

These classes define the structure of data sent and received via the API.
They are used to control what data is accepted (e.g., in POST/PUT requests)
and what data is returned (e.g., in GET responses).

Example:
    from app.schemas.user import UserCreate, UserRead

Note:
    These models should not be used for database operations.
    For interacting with the database, use the models in `app.models`.
"""