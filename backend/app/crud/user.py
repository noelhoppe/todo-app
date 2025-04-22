""" CRUD operations for 'User' model """

from sqlalchemy import select

from ..models.user import User
from ..core.dependencies import DatabaseSessionDep

def get_user(username: str, db_session: DatabaseSessionDep) -> User | None:
  """ SELECT * FROM users WHERE users.username = username LIMIT 1 """
  sql_statement = select(User).where(username == User.username)
  result = db_session.exec(sql_statement).first()
  return result