# --- EXTERN IMPORTS ---
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  frontend_url: str
  db_url: str
  access_token_expire_minutes: int
  secret_key: str
  refresh_token_secret_key: str
  refresh_token_expire_days: int
  symmetric_algorithm: str
  
settings = Settings()

if __name__ == "__main__":
  print(settings.frontend_url)
  print(settings.db_url)
  print(settings.access_token_expire_minutes)
  print(settings.secret_key)
  print(settings.refresh_token_secret_key)
  print(settings.refresh_token_expire_days)
  print(settings.symmetric_algorithm)