from typing import Annotated

from sqlalchemy.orm import Session, sessionmaker
from fastapi import Depends

from app.core.db import engine
from app.models.user import User

SessionLocal = sessionmaker(
  bind=engine,
  autocommit=False,
  autoflush=False
)


def get_session():
  """ Dependency function to get a database session """
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

DatabaseSessionDep = Annotated[Session, Depends(get_session)]

from app.core.security import get_current_user
GetCurrentUser = Annotated[User, Depends(get_current_user)]