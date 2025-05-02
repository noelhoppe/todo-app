"""
Configuration management for the application.

This module loads and provides access to global settings using Pydantic's `BaseSettings`.
It handles environment variables and configuration files, enabling flexible management of configuration settings.

Configuration settings can include:
- Database URL
- API keys
- Frontend URL and other environment-specific variables

Example:
    from app.core.config import settings
    print(settings.database_url)
"""

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  frontend_url: str
  database_url: str
  algorithm: str
  access_token_expire_minutes: float

settings = Settings()

if __name__ == "__main__":
  print(settings.frontend_url)
  print(settings.database_url)
  print(settings.algorithm)
  print(settings.access_token_expire_minutes)