# AgentPut 快速使用指南

## 🎯 项目概述

AgentPut 是一个基于 Microsoft Autogen 的多智能体协作平台，提供了美观现代的 Web 界面来管理 Agent 和 Team。

## ✨ 已完成的功能

### 前端界面（参考 Coze 风格）
- ✅ **用户系统**
  - 用户注册和登录
  - JWT Token 认证
  - 用户资料管理

- ✅ **Agent 管理**
  - Agent 列表展示（表格形式）
  - 创建/编辑/删除 Agent
  - Monaco Editor 编辑 System Message
  - 配置 Handoffs（任务转交）
  - 配置 Tools（工具集）

- ✅ **Team 管理**
  - Team 列表展示
  - 创建/编辑/删除 Team
  - 选择 Team 成员（Agents）
  - 设置入口 Agent

- ✅ **现代化 UI**
  - Semi Design 组件库
  - 蓝紫色主题（#4d53e8）
  - 左侧导航栏 + 顶部用户栏
  - 响应式布局
  - 流畅的交互动画

## 🚀 启动步骤

### 1. 启动后端服务

```bash
# 在项目根目录
uv run python -m backend.main
```

后端运行在：http://localhost:8000

### 2. 启动前端服务

```bash
# 在项目根目录的 frontend 文件夹中
cd frontend
npm run dev
```

前端运行在：http://localhost:3000

## 📖 使用流程

### 第一步：注册账号

1. 访问 http://localhost:3000
2. 点击"立即注册"
3. 填写用户名、邮箱和密码
4. 注册成功后自动跳转到登录页

### 第二步：登录系统

1. 使用注册的邮箱和密码登录
2. 登录成功后进入首页 Dashboard

### 第三步：创建 Agent

1. 点击左侧导航"Agent 管理"
2. 点击右上角"创建 Agent"按钮
3. 填写 Agent 信息：
   - **Agent 名称**：给你的智能体起个名字
   - **System Message**：使用 Monaco Editor 编辑器定义 Agent 的角色和能力
   - **Handoffs**（可选）：选择可以转交任务的其他 Agent
   - **Tools**（可选）：输入工具名称
4. 点击"创建"保存

**示例 Agent:**
```
名称: ResearchAgent
System Message: 你是一个专业的研究助手，擅长搜索和整理信息。
```

### 第四步：创建更多 Agent

根据需要创建多个 Agent，例如：
- **CodeAgent**: 代码编写专家
- **ReviewAgent**: 代码审查专家
- **DocumentAgent**: 文档编写专家

### 第五步：创建 Team

1. 点击左侧导航"Team 管理"
2. 点击右上角"创建 Team"按钮
3. 填写 Team 信息：
   - **Team 名称**：团队名称
   - **描述**：简单描述团队用途
   - **Team Agents**：选择团队成员（之前创建的 Agents）
   - **入口 Agent**：选择接收初始任务的 Agent
4. 点击"创建"保存

**示例 Team:**
```
名称: 开发团队
描述: 代码开发和审查团队
Agents: CodeAgent, ReviewAgent, DocumentAgent
入口 Agent: CodeAgent
```

## 🎨 UI 设计特色

### Coze 风格设计
- **配色**：蓝紫色主调（#4d53e8）
- **布局**：三栏式（侧边栏 + 顶栏 + 内容区）
- **组件**：Semi Design 企业级组件库
- **编辑器**：Monaco Editor（VS Code 同款）

### 主要页面

1. **登录/注册页**
   - 渐变紫色背景
   - 卡片式表单
   - 表单验证

2. **Dashboard**
   - 快速创建入口
   - 功能卡片展示

3. **Agent 列表**
   - 表格展示
   - 工具和 Handoff 数量标签
   - 编辑/删除操作

4. **Agent 编辑**
   - Monaco Editor 代码编辑
   - 多选下拉框
   - 实时验证

5. **Team 列表**
   - Agent 数量统计
   - 入口 Agent 高亮

6. **Team 编辑**
   - 动态 Agent 选择
   - 入口 Agent 智能联动

## 🔌 API 集成

前端已完整集成后端 API：

- `/api/users/*` - 用户管理
- `/api/agents/*` - Agent 管理
- `/api/teams/*` - Team 管理
- `/api/conversations/*` - 对话管理（待实现）

## 📝 技术栈

### 前端
- React 18 + TypeScript
- Vite（构建工具）
- Semi Design（UI 组件库）
- Zustand（状态管理）
- React Router v6（路由）
- Monaco Editor（代码编辑）
- Axios（HTTP 客户端）

### 后端
- FastAPI
- SQLAlchemy 2.0（异步 ORM）
- MySQL 8.0+
- JWT 认证

## 🎯 下一步开发

- [ ] 对话运行界面
- [ ] WebSocket 实时通信
- [ ] Autogen Swarm 集成
- [ ] MCP 工具系统
- [ ] 对话事件回放

## 💡 提示

1. **首次使用**：需要先注册账号才能使用系统
2. **Token 过期**：24小时后需要重新登录
3. **编辑器**：System Message 支持 Markdown 语法
4. **Handoffs**：只能选择已存在的其他 Agent
5. **入口 Agent**：必须是 Team 成员之一

## 🐛 常见问题

### 前端无法连接后端？
检查后端是否运行在 http://localhost:8000

### 登录失败？
确保邮箱和密码正确，密码至少6位

### 创建 Agent 失败？
检查 Agent 名称是否重复

### Monaco Editor 不显示？
刷新页面或检查浏览器控制台错误

## 📞 联系方式

如有问题，请提交 Issue 到 GitHub 仓库。

---

**祝使用愉快！** 🚀
