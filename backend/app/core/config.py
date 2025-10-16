from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str = "mysql+aiomysql://root:password@localhost:3306/agentput"
    DATABASE_POOL_SIZE: int = 20

    # 安全配置
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    # API配置
    API_PREFIX: str = "/api"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # MCP配置
    MCP_CONFIG_PATH: str = "./configs/mcps.json"
    MCP_TIMEOUT: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
