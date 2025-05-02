"""
Database connection and management.

This module establishes a connection to the PostgreSQL database using SQLModel.
It also provides a utility function to create tables in the database based on the defined models.

Functions:
    - create_tables: Creates all tables defined in the models if they don't exist.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

class Base(DeclarativeBase):
  pass

# Establishing databse Connectivity
engine = create_engine(settings.database_url, echo=True) 

def create_tables():
  """ Create tables in the database if they don't exist """
  from app.models.todo import ToDo
  from app.models.user import User
  Base.metadata.create_all(engine)