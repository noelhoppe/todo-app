"""
Database model for the User entity.

This model defines the structure of the 'users' table in the database.
It includes authentication-relevant fields and is used for DB operations.

Attributes:
    id (int): Primary key, auto-generated.
    username (str): Unique username of the user.
    hashed_password (str): Hashed password for authentication.
"""

from sqlalchemy import Column, Integer, String

from app.core import db

class User(db.Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True, nullable=False)
  username = Column(String, unique=True)
  hashed_password = Column(String)