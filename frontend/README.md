# AgentPut 前端

基于 React 18 + TypeScript + Vite + Semi Design 的现代化 UI 界面

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Semi Design** - UI 组件库（参考 Coze 风格）
- **Zustand** - 状态管理
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **Monaco Editor** - 代码编辑器

## 功能特性

### 已实现功能

- ✅ 用户登录/注册
- ✅ 主布局（左侧导航 + 顶部栏）
- ✅ Agent 管理（CRUD）
  - 列表展示
  - 创建/编辑 Agent
  - System Message 编辑器（Monaco Editor）
  - Handoffs 配置
  - Tools 配置
- ✅ Team 管理（CRUD）
  - 列表展示
  - 创建/编辑 Team
  - Agent 选择
  - 入口 Agent 设置
- ✅ Dashboard 首页

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 公共组件
│   └── MainLayout.tsx  # 主布局
├── pages/              # 页面组件
│   ├── Login.tsx       # 登录页
│   ├── Register.tsx    # 注册页
│   ├── Dashboard.tsx   # 首页
│   ├── Agent/          # Agent 管理
│   │   ├── AgentList.tsx
│   │   └── AgentEdit.tsx
│   ├── Team/           # Team 管理
│   │   ├── TeamList.tsx
│   │   └── TeamEdit.tsx
│   └── Conversation/   # 对话管理
│       └── ConversationList.tsx
├── services/           # API 服务
│   └── api.ts
├── store/              # 状态管理
│   └── index.ts
├── types/              # TypeScript 类型
│   └── index.ts
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## API 代理配置

开发环境下，Vite 会自动代理以下请求到后端：

- `/api/*` -> `http://localhost:8000/api/*`
- `/ws` -> `ws://localhost:8000/ws`

## 主题色

参考 Coze 官方设计，使用蓝紫色主题：

- 主色：`#4d53e8`
- 渐变背景：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

## 注意事项

1. 确保后端 API 服务运行在 `http://localhost:8000`
2. 首次使用需要先注册账号
3. Token 保存在 localStorage 中
4. 所有 API 请求都会自动添加 Authorization header
