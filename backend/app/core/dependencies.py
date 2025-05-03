from typing import Annotated

from sqlalchemy.orm import Session
from fastapi import Depends

from app.core.db import engine
from app.models.user import User
from app.core.security import get_current_user


def get_session():
  """ Dependency function to get a database session """
  with Session(engine) as session:
    yield session

DatabaseSessionDep = Annotated[Session, Depends(get_session)]
GetCurrentUser = Annotated[User, Depends(get_current_user)]