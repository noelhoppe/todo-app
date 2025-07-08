# --- EXTERN IMPORTS ---
from contextlib import contextmanager
from typing import Annotated, Generator
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlmodel import Session

# --- INTERN IMPORTS ---
from src.core.config import settings

engine = create_engine(settings.db_url, echo=True) 

class Base(DeclarativeBase):
  pass

def get_session():
  """ Dependency function to get a database session """
  with Session(engine) as session:
    try:
      yield session
    except:
      session.rollback()
      print("❌ Error in database session - rolling back")
      raise
    finally:
      session.close()
      print("🔒 Database Session closed")

@contextmanager
def get_db_session():
  """ Context manager for manual database sessions """
  with Session(engine) as session:
    try:
      yield session
    except:
      session.rollback()
      print("❌ Error in database session - rolling back")
      raise
    finally:
      session.close()
      print("🔒 Database Session closed")


def create_tables():
  """ Create all tables in the database """
  Base.metadata.create_all(engine)

DatabaseSessionDep = Annotated[Session, Depends(get_session)]