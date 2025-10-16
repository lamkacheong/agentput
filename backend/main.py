from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.endpoints import users, agents, teams, conversations

# 创建FastAPI应用
app = FastAPI(
    title="AgentPut API",
    description="多智能体系统（MAS）平台 API",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(agents.router, prefix=f"{settings.API_PREFIX}/agents", tags=["agents"])
app.include_router(teams.router, prefix=f"{settings.API_PREFIX}/teams", tags=["teams"])
app.include_router(conversations.router, prefix=f"{settings.API_PREFIX}/conversations", tags=["conversations"])


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "欢迎使用 AgentPut API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
