from sqlalchemy import select
from fastapi import Depends
from sqlmodel import Session

from app.models.user import User
from app.core.dependencies import DatabaseSessionDep

def get_user(username: str, db_session: DatabaseSessionDep) -> User | None:
  """ SELECT * FROM users WHERE users.username = username LIMIT 1 """
  sql_statement = select(User).where(User.username == username)
  result = db_session.scalars(sql_statement).first()
  return result

def insert_user(username: str, hashed_password: str, db_session: DatabaseSessionDep):
  user = User(username=username, hashed_password=hashed_password)
  db_session.add(user)
  db_session.commit()