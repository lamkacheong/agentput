# AgentPut - 多智能体系统平台

AgentPut 是一个开源的 no-code 多智能体系统（MAS）平台，让非技术用户通过简单直观的界面创建和管理真正的智能体协作系统。

## 功能特性

- **用户管理**：注册、登录、JWT认证
- **Agent管理**：创建、编辑、删除智能体
- **Team管理**：组建智能体团队
- **Conversation管理**：管理对话任务

## 技术栈

### 后端
- **框架**：FastAPI
- **数据库**：MySQL 8.0+
- **ORM**：SQLAlchemy 2.0 (异步)
- **认证**：JWT Token
- **Python**：3.10+

### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI 组件库**：Semi Design (参考 Coze 风格)
- **状态管理**：Zustand
- **路由**：React Router v6
- **代码编辑器**：Monaco Editor

## 快速开始

### 1. 环境要求

- Python 3.10+
- MySQL 8.0+
- uv (Python包管理工具)

### 2. 安装依赖

```bash
# 使用 uv 安装依赖
uv pip install -r requirements.txt
```

### 3. 配置数据库

1. 创建数据库：
```sql
CREATE DATABASE agentput CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置环境变量（已创建 .env 文件）：
```
DATABASE_URL=mysql+aiomysql://root:Blue1?@127.0.0.1:3306/agentput
```

### 4. 初始化数据库

```bash
uv run python scripts/init_db.py
```

### 5. 启动后端服务器

```bash
# 方式1：使用启动脚本
./scripts/run_server.sh

# 方式2：直接运行
uv run python -m backend.main
```

服务器启动后访问：
- API文档：http://localhost:8000/docs
- 健康检查：http://localhost:8000/health

### 6. 启动前端（两种方式）

#### 方式一：开发模式（独立启动前端）

```bash
cd frontend
npm install  # 首次运行需要安装依赖
npm run dev
```

前端服务启动后访问：http://localhost:3000

#### 方式二：生产模式（前端打包后挂载到后端）

```bash
# 1. 构建前端
./scripts/build_frontend.sh

# 2. 只启动后端即可
uv run python -m backend.main
```

访问：**http://localhost:8000** （前端和后端都在同一个端口）

> 💡 推荐使用方式二，这样只需要启动一个服务，前端会被自动挂载到后端

## API 端点

### 用户管理
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息

### Agent 管理
- `GET /api/agents` - 获取Agent列表
- `POST /api/agents` - 创建Agent
- `GET /api/agents/{id}` - 获取Agent详情
- `PUT /api/agents/{id}` - 更新Agent
- `DELETE /api/agents/{id}` - 删除Agent
- `GET /api/agents/available/list` - 获取可用Agent列表

### Team 管理
- `GET /api/teams` - 获取Team列表
- `POST /api/teams` - 创建Team
- `GET /api/teams/{id}` - 获取Team详情
- `PUT /api/teams/{id}` - 更新Team
- `DELETE /api/teams/{id}` - 删除Team

### Conversation 管理
- `GET /api/conversations` - 获取对话列表
- `POST /api/conversations` - 创建对话
- `GET /api/conversations/{id}` - 获取对话详情
- `DELETE /api/conversations/{id}` - 删除对话

## 项目结构

```
agentput/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/      # API路由
│   │   │   └── deps.py         # 依赖注入
│   │   ├── core/
│   │   │   ├── config.py       # 配置
│   │   │   ├── database.py     # 数据库连接
│   │   │   └── security.py     # 安全相关
│   │   ├── models/             # 数据库模型
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # 业务逻辑
│   │   └── websocket/          # WebSocket管理
│   └── main.py                 # 主应用入口
├── frontend/
│   ├── src/
│   │   ├── components/         # 公共组件
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # API服务
│   │   ├── store/              # 状态管理
│   │   └── types/              # TypeScript类型
│   ├── package.json
│   └── vite.config.ts
├── scripts/
│   ├── init_db.py             # 数据库初始化
│   └── run_server.sh          # 启动脚本
├── .env                       # 环境变量
├── requirements.txt           # 依赖列表
└── README.md                  # 项目文档
```

## 开发状态

### ✅ 已完成
- [x] 项目基础结构搭建
- [x] 数据库模型设计
- [x] 用户认证系统
- [x] Agent CRUD API
- [x] Team CRUD API
- [x] Conversation CRUD API
- [x] 前端 UI 界面（基于 Semi Design）
  - [x] 用户登录/注册
  - [x] Agent 管理（CRUD）
  - [x] Team 管理（CRUD）
  - [x] 主布局和导航系统
  - [x] Monaco Editor 集成（System Message 编辑）

### 🚧 待开发
- [ ] Microsoft Autogen 集成
- [ ] MCP 工具系统
- [ ] WebSocket 实时通信
- [ ] 事件存储和回放
- [ ] 对话运行界面
- [ ] 对话回放功能

## 📚 相关文档

- [快速使用指南](QUICKSTART.md) - 快速上手教程
- [部署指南](DEPLOYMENT.md) - 生产环境部署
- [前端文档](frontend/README.md) - 前端开发说明

## 🔧 脚本说明

- `scripts/init_db.py` - 初始化数据库
- `scripts/run_server.sh` - 启动后端服务
- `scripts/build_frontend.sh` - 构建前端项目

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
