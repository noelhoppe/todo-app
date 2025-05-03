from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

class Base(DeclarativeBase):
  pass

engine = create_engine(settings.database_url, echo=True) 

def create_tables():
  from app.models.todo import ToDo
  from app.models.user import User
  Base.metadata.create_all(engine)