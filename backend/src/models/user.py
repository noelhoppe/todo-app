from sqlalchemy import Column, Integer, String

from src.core import db

class User(db.Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True, nullable=False)
  username = Column(String, unique=True)
  hashed_password = Column(String)