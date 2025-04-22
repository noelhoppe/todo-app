"""
Shared dependencies for the application.

This module defines reusable dependencies used throughout the FastAPI application.
Dependencies help manage the flow of data, such as database sessions or authenticated users, across various routes and services.

Functions:
    - get_db_session: Provides a database session for interacting with the database.
    - get_current_user: Retrieves the current authenticated user based on the JWT token.
"""


from typing import Annotated
from sqlmodel import Session
from fastapi import Depends

from .db import engine

def get_session():
  """ Dependency function to get a database session """
  with Session(engine) as session:
    yield session

# Annotate the database session dependency
DatabaseSessionDep = Annotated[Session, Depends(get_session)]