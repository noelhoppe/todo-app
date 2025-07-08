# --- EXTERN IMPORTS ---
from sqlalchemy import select
from sqlmodel import Session

# --- INTERN IMPORTS ---
from src.models.user import User

def get_user(username: str, db_session: Session) -> User | None:
  """ SELECT * FROM users WHERE users.username = username LIMIT 1 """
  sql_statement = select(User).where(User.username == username)
  result = db_session.scalar(sql_statement)
  return result

def get_user_by_id(user_id: int, db_session: Session) -> User | None:
  """ SELECT * FROM users WHERE users.id = user_id LIMIT 1 """
  sql_statement = select(User).where(User.id == user_id)
  result = db_session.scalar(sql_statement)
  return result

def insert_user(username: str, hashed_password: str, db_session: Session) -> None:
  """ INSERT (username, hashed_password) INTO users VALUES(username, hashed_password) """
  user = User(username=username, hashed_password=hashed_password)
  db_session.add(user)
  db_session.commit()