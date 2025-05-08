from typing import Annotated
from fastapi import Depends
from sqlalchemy import select
from sqlmodel import Session

from src.models.user import User

def get_user(username: str, db_session: Session) -> User | None:
  """ SELECT * FROM users WHERE users.username = username LIMIT 1 """
  sql_statement = select(User).where(User.username == username)
  result = db_session.scalars(sql_statement).first()
  return result

def insert_user(username: str, hashed_password: str, db_session: Session) -> None:
  user = User(username=username, hashed_password=hashed_password)
  db_session.add(user)
  db_session.commit()