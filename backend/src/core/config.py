from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  frontend_url: str
  database_url: str
  access_token_expire_minutes: float
  secret_key: str
  symmetric_algorithm: str
  
settings = Settings()

if __name__ == "__main__":
  print(settings.frontend_url)
  print(settings.database_url)
  print(settings.symmetric_algorithm)
  print(settings.access_token_expire_minutes)
  print(settings.secret_key)