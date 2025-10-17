# AgentPut 部署指南

## 🚀 快速部署

### 前置要求

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- uv (Python 包管理工具)

### 部署步骤

#### 1. 配置数据库

```sql
CREATE DATABASE agentput CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. 配置环境变量

创建 `.env` 文件：

```bash
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/agentput
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
CORS_ORIGINS=["*"]
```

#### 3. 安装依赖

```bash
# 安装 Python 依赖
uv pip install -r requirements.txt

# 安装 Node.js 依赖
cd frontend && npm install && cd ..
```

#### 4. 初始化数据库

```bash
uv run python scripts/init_db.py
```

#### 5. 构建前端

```bash
./scripts/build_frontend.sh
```

这将把前端打包到 `backend/static` 目录。

#### 6. 启动服务

```bash
uv run python -m backend.main
```

服务将运行在 http://localhost:8000

## 📦 生产环境部署

### 使用 Gunicorn + Uvicorn

```bash
# 安装 gunicorn
uv pip install gunicorn

# 启动服务（4个worker）
gunicorn backend.main:app \\
  --workers 4 \\
  --worker-class uvicorn.workers.UvicornWorker \\
  --bind 0.0.0.0:8000 \\
  --access-logfile - \\
  --error-logfile -
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件（可选，由 FastAPI 处理）
    # location / {
    #     root /path/to/agentput/backend/static;
    #     try_files $uri $uri/ /index.html;
    # }

    # API 代理到 FastAPI
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 支持
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# 安装 Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# 复制文件
COPY requirements.txt .
COPY frontend/package.json frontend/
COPY . .

# 安装依赖
RUN pip install uv
RUN uv pip install -r requirements.txt
RUN cd frontend && npm install && cd ..

# 构建前端
RUN cd frontend && npm run build && cd ..

# 暴露端口
EXPOSE 8000

# 启动服务
CMD ["python", "-m", "backend.main"]
```

构建和运行：

```bash
docker build -t agentput .
docker run -p 8000:8000 --env-file .env agentput
```

## 🔄 更新部署

当代码更新后：

```bash
# 1. 拉取最新代码
git pull

# 2. 更新依赖（如果有变化）
uv pip install -r requirements.txt
cd frontend && npm install && cd ..

# 3. 重新构建前端
./scripts/build_frontend.sh

# 4. 重启服务
# systemd
sudo systemctl restart agentput

# 或手动重启
pkill -f "python -m backend.main"
uv run python -m backend.main
```

## 📊 性能优化

### 1. 数据库连接池

在 `.env` 中配置：

```
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
```

### 2. 静态文件 CDN

可以将 `backend/static` 目录上传到 CDN，然后修改 HTML 中的资源路径。

### 3. Gzip 压缩

在 Nginx 中启用 gzip：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## 🔒 安全建议

1. **使用强密钥**：生成随机的 `SECRET_KEY`
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **配置 CORS**：仅允许必要的域名
   ```
   CORS_ORIGINS=["https://your-domain.com"]
   ```

3. **HTTPS**：在生产环境使用 SSL/TLS

4. **数据库安全**：使用专用数据库用户，限制权限

5. **防火墙**：仅开放必要的端口（80, 443, 8000）

## 📝 监控和日志

### 日志配置

修改 `backend/app/core/config.py` 添加日志配置：

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/agentput/app.log'),
        logging.StreamHandler()
    ]
)
```

### 健康检查

```bash
curl http://localhost:8000/health
```

返回 `{"status":"ok"}` 表示服务正常。

## 🐛 故障排查

### 前端无法加载

检查：
1. `backend/static` 目录是否存在
2. `index.html` 和 `assets` 目录是否存在
3. 后端日志是否有错误

### 数据库连接失败

检查：
1. MySQL 服务是否运行
2. 数据库连接字符串是否正确
3. 用户权限是否足够

### API 请求失败

检查：
1. CORS 配置是否正确
2. JWT Token 是否过期
3. 后端日志中的错误信息

## 📞 支持

如有问题，请提交 Issue 到 GitHub 仓库。
