"""
Database connection and management.

This module establishes a connection to the PostgreSQL database using SQLModel.
It also provides a utility function to create tables in the database based on the defined models.

Functions:
    - create_tables: Creates all tables defined in the models if they don't exist.
"""


from sqlmodel import create_engine, SQLModel, Session
from fastapi import Depends
from typing import Annotated

from ..core.config import settings
# Create the engine - connect to the PostgreSQL database
engine = create_engine(settings.database_url, echo=True) 

def create_tables():
  """ Create tables in the database if they don't exist """
  SQLModel.metadata.create_all(engine)