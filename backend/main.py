from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
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

# 注册API路由
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(agents.router, prefix=f"{settings.API_PREFIX}/agents", tags=["agents"])
app.include_router(teams.router, prefix=f"{settings.API_PREFIX}/teams", tags=["teams"])
app.include_router(conversations.router, prefix=f"{settings.API_PREFIX}/conversations", tags=["conversations"])


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}


# 静态文件目录
STATIC_DIR = Path(__file__).parent / "static"

# 挂载静态文件（如果存在）
if STATIC_DIR.exists():
    # 挂载静态资源（JS、CSS、图片等）
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """
        服务前端SPA应用
        对于所有非API路径，返回index.html，让前端路由处理
        """
        # API路径已经在前面处理了
        # 检查是否是静态文件
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        # 否则返回 index.html（用于前端路由）
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)

        # 如果没有前端文件，返回API信息
        return {
            "message": "欢迎使用 AgentPut API",
            "version": "0.1.0",
            "docs": "/docs",
            "note": "前端文件未找到，请先构建前端项目"
        }
else:
    @app.get("/")
    async def root():
        """根路径"""
        return {
            "message": "欢迎使用 AgentPut API",
            "version": "0.1.0",
            "docs": "/docs",
            "note": "前端文件未找到，请先构建前端项目：cd frontend && npm run build"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
