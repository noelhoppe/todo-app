from typing import Annotated

from sqlalchemy.orm import Session
from fastapi import Depends

from app.core.db import engine

def get_session():
  """ Dependency function to get a database session """
  with Session(engine) as session:
    yield session

DatabaseSessionDep = Annotated[Session, Depends(get_session)]

from app.core.security import get_access_token_from_cookie
AccessTokenFromCookie = Annotated[str, Depends(get_access_token_from_cookie)]