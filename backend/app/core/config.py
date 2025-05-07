from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  frontend_url: str
  database_url: str
  algorithm: str
  access_token_expire_minutes: float
  public_key_path: str
  private_key_path: str
  private_key_password: bytes
  
settings = Settings()

if __name__ == "__main__":
  print(settings.frontend_url)
  print(settings.database_url)
  print(settings.algorithm)
  print(settings.access_token_expire_minutes)
  print(settings.public_key_path)
  print(settings.private_key_path)
  print(settings.private_key_password)