# AgentPut 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 产品定位
AgentPut 是一个开源的 no-code 多智能体系统（MAS）平台，让非技术用户通过简单直观的界面创建和管理真正的智能体协作系统。区别于传统的工作流编排工具，AgentPut 专注于构建能够自主决策、动态协作的智能体团队。

### 1.2 核心价值主张
- **真正的智能体系统**：基于 Microsoft Autogen，实现Agent间的自主协作和任务转交
- **零代码配置**：通过表单配置Agent能力和协作关系，无需编程
- **实时监控与回放**：完整记录Agent协作过程，支持断点续传和历史回放
- **MCP工具生态**：原生支持 Model Context Protocol，轻松接入各类工具服务

### 1.3 目标用户
- 需要构建智能体应用的业务人员
- AI研究人员和教育工作者
- 希望探索多智能体协作的开发者
- 企业级AI应用的原型验证团队

## 2. 技术架构

### 2.1 整体架构
- **架构模式**：前后端分离的单体应用
- **部署方式**：FastAPI 作为主应用框架，前端编译后作为静态资源挂载

### 2.2 技术栈
#### 后端
- **框架**：FastAPI (Python 3.10+)
- **MAS引擎**：Microsoft Autogen
- **数据库**：MySQL 8.0+
- **ORM**：SQLAlchemy 2.0
- **异步处理**：asyncio + aiohttp
- **MCP客户端**：StreamableHttp（统一的HTTP协议MCP通信层）

#### 前端
- **框架**：React 18+
- **状态管理**：Redux Toolkit 或 Zustand
- **UI组件库**：Ant Design 或 Material-UI
- **实时通信**：WebSocket（用于实时事件流）
- **代码编辑器**：Monaco Editor（用于编辑system_message）

### 2.3 路由设计
```
/              # 前端应用入口
/api/*         # 后端 API 路由
/ws            # WebSocket 连接端点
/static/*      # 静态资源
```

## 3. 核心概念定义

### 3.1 Agent（智能体）
基于 Autogen 的 `AssistantAgent` 类实现，每个 Agent 是一个独立的智能实体：
- **name**：Agent的唯一标识符
- **system_message**：定义Agent的角色、能力和行为准则
- **handoffs**：可以将任务转交给的其他Agent列表（字符串数组）
- **tools**：Agent可以调用的MCP工具集合

### 3.2 Team（团队）
统一采用 `autogen_agentchat.teams.Swarm` 实现：
- 所有Team都是Swarm类型，支持Agent间的动态任务转交
- 使用Swarm的默认终止条件
- 支持异步执行和实时事件流
- Agent通过handoffs定义协作拓扑

### 3.3 MCP（Model Context Protocol）工具系统
基于 [Model Context Protocol](https://modelcontextprotocol.io/) 标准：
- 通过 `mcps.json` 配置文件定义MCP服务器列表
- 系统启动时自动连接所有配置的MCP服务器
- 使用 StreamableHttp 统一处理所有MCP通信
- 支持工具的动态发现和调用

## 4. 数据模型设计

### 4.1 用户模型 (User)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);
```

### 4.2 Agent 模型
```sql
CREATE TABLE agents (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    system_message TEXT NOT NULL,
    handoffs JSON,  -- ["agent_name1", "agent_name2"]
    tools JSON,     -- ["tool_name1", "tool_name2"]
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_name (name),
    INDEX idx_created_by (created_by)
);
```

### 4.3 Team 模型
```sql
CREATE TABLE teams (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    agents JSON NOT NULL,  -- ["agent_id1", "agent_id2"]
    entry_agent VARCHAR(36) NOT NULL,  -- 初始接收任务的Agent
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_created_by (created_by)
);
```

### 4.4 Conversation 模型
```sql
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    task TEXT NOT NULL,  -- 用户输入的初始任务
    status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);
```

### 4.5 Event 模型
```sql
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    event_type ENUM('TextMessage', 'ToolCallRequestEvent', 'ToolCallExecutionEvent', 
                    'ToolCallSummaryMessage', 'AgentMessageChunk', 'HandoffMessage') NOT NULL,
    timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    agent_name VARCHAR(100),
    data JSON NOT NULL,  -- 事件的具体内容
    sequence INT NOT NULL,  -- 事件在对话中的顺序
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sequence (conversation_id, sequence)
);
```

### 4.6 MCP 服务器配置
基于 MCP 标准的配置文件 `mcps.json`：
```json
{
  "mcpServers": [
    {
      "name": "filesystem",
      "url": "http://localhost:3001",
      "apiKey": "optional-api-key",
      "description": "文件系统访问工具"
    },
    {
      "name": "github",
      "url": "http://localhost:3002",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      },
      "description": "GitHub仓库访问工具"
    },
    {
      "name": "database",
      "url": "http://localhost:3003",
      "description": "数据库访问工具"
    }
  ]
}
```

系统启动时读取此配置，通过 StreamableHttp 以HTTP协议连接各个 MCP 服务器，并动态发现可用工具。所有MCP通信统一使用StreamableHttp处理。

## 5. API 接口设计

### 5.1 用户管理
```
POST   /api/users/register     # 用户注册
POST   /api/users/login        # 用户登录
GET    /api/users/profile      # 获取当前用户信息
PUT    /api/users/profile      # 更新用户信息
```

### 5.2 Agent 管理
```
GET    /api/agents              # 获取Agent列表
POST   /api/agents              # 创建新Agent
GET    /api/agents/{id}         # 获取Agent详情
PUT    /api/agents/{id}         # 更新Agent
DELETE /api/agents/{id}         # 删除Agent
GET    /api/agents/available    # 获取可用于handoff的Agent列表
POST   /api/agents/validate     # 验证Agent配置（检查handoff循环等）
```

### 5.3 Team 管理
```
GET    /api/teams               # 获取Team列表
POST   /api/teams               # 创建新Team
GET    /api/teams/{id}          # 获取Team详情
PUT    /api/teams/{id}          # 更新Team
DELETE /api/teams/{id}          # 删除Team
POST   /api/teams/validate      # 验证Team配置的有效性
```

### 5.4 Conversation 管理
```
GET    /api/conversations              # 获取对话列表
POST   /api/conversations              # 创建新对话（启动Team）
GET    /api/conversations/{id}         # 获取对话详情
DELETE /api/conversations/{id}         # 删除对话
POST   /api/conversations/{id}/cancel  # 取消运行中的对话
GET    /api/conversations/{id}/replay  # 获取完整的对话回放数据
```

### 5.5 Event 流
```
GET    /api/conversations/{id}/events         # 获取对话的所有事件（支持分页）
GET    /api/conversations/{id}/events/stream  # SSE事件流（备选方案）
WS     /ws/conversations/{id}                 # WebSocket实时事件流（主要方案）
```

### 5.6 MCP 工具管理
```
GET    /api/tools                      # 获取所有可用工具列表
GET    /api/tools/servers              # 获取MCP服务器连接状态
POST   /api/tools/servers/reload       # 重新加载MCP服务器配置
GET    /api/tools/{tool_name}/schema   # 获取特定工具的参数schema
```

## 6. 前端功能模块

### 6.1 首页仪表板
- **最近对话**：显示用户最近的5-10个对话，包含状态和时间
- **我的Teams**：Team卡片列表，显示包含的Agent数量
- **快速开始**：选择Team并输入任务直接启动新对话
- **系统状态**：显示MCP服务器连接状态和可用工具数量

### 6.2 用户管理界面
- **登录/注册页面**：简洁的表单界面
- **个人中心**：显示用户名、创建时间、统计信息
- **退出登录**：清理会话并返回登录页

### 6.3 Agent 编辑器
#### 列表页面
- 表格展示所有Agent
- 显示字段：名称、创建者、创建时间、工具数量、handoff数量
- 操作：编辑、删除、复制

#### 编辑页面
- **基本信息**
  - Agent名称（唯一性验证）
  - 描述（可选）
  
- **System Message编辑器**
  - Monaco Editor 或富文本编辑器
  - 支持Markdown预览
  - 提供常用prompt模板
  
- **Handoffs配置**
  - 多选下拉框选择其他Agent
  - 显示已选Agent的简要信息
  - 循环引用检测和警告
  
- **Tools配置**
  - 从可用MCP工具列表中多选
  - 显示每个工具的描述和参数说明
  - 工具分组显示（按MCP服务器）

### 6.4 Team 编排器
#### 列表页面
- 卡片或表格展示所有Team
- 显示包含的Agent和入口Agent
- 快速启动按钮

#### 编辑页面
- **基本信息**
  - Team名称
  - 描述
  
- **Agent选择**
  - 多选Agent加入Team
  - 设置入口Agent（下拉选择）
  
- **Handoff关系展示**
  - 简单的列表形式展示Agent间的handoff关系
  - 格式：`AgentA → [AgentB, AgentC]`
  - 高亮显示入口Agent
  
- **配置验证**
  - 检查是否存在孤立的Agent
  - 检查handoff关系是否都在Team内
  - 验证结果实时显示

### 6.5 对话运行界面
#### 任务输入区
- 大文本框输入任务描述
- Team选择下拉框
- "开始执行"按钮

#### 实时对话展示
- **消息流**
  - Agent消息以对话气泡形式展示
  - 显示Agent头像和名称
  - 流式输出支持打字机效果
  
- **工具调用展示**
  - 可折叠的卡片形式
  - 显示工具名称、参数、执行结果
  - 执行中显示loading动画
  
- **Handoff事件**
  - 特殊样式高亮
  - 显示：`🔄 任务从 AgentA 转交给 AgentB`
  
- **状态指示器**
  - 顶部固定栏显示当前状态
  - 正在思考/调用工具/等待响应等状态
  
#### 控制区
- 取消按钮（仅在运行中显示）
- 导出对话按钮
- 回放模式切换

### 6.6 对话回放器
- **事件列表**
  - 左侧时间轴形式展示所有事件
  - 点击事件跳转到对应位置
  - 事件类型用不同图标区分
  
- **回放控制**
  - 播放/暂停按钮
  - 播放速度调节（0.5x, 1x, 2x, 5x）
  - 进度条拖动
  
- **内容展示**
  - 与运行界面类似的展示方式
  - 支持断点续播（记住上次播放位置）
  
- **导出功能**
  - 导出为JSON格式
  - 导出为Markdown格式的对话记录

## 7. 核心业务流程

### 7.1 Team 运行流程
```python
# 伪代码描述核心流程
async def run_team(user_id, team_id, task):
    # 1. 创建Conversation记录
    conversation = create_conversation(user_id, team_id, task)
    
    # 2. 加载Team配置和Agents
    team = load_team(team_id)
    agents = load_agents(team.agents)
    
    # 3. 初始化Autogen Swarm
    swarm = Swarm(
        agents=agents,
        entry_agent=team.entry_agent
    )
    
    # 4. 设置事件处理器
    swarm.on_event = lambda event: handle_event(conversation.id, event)
    
    # 5. 异步执行任务
    try:
        result = await swarm.run_async(task)
        update_conversation_status(conversation.id, 'completed')
    except Exception as e:
        update_conversation_status(conversation.id, 'failed')
        log_error(e)
    
    return conversation.id
```

### 7.2 事件处理机制
```python
async def handle_event(conversation_id, event):
    # 1. 序列化事件数据
    event_data = serialize_event(event)
    
    # 2. 保存到数据库
    save_event_to_db(conversation_id, event_data)
    
    # 3. 推送到WebSocket
    await broadcast_to_websocket(conversation_id, event_data)
    
    # 4. 特殊事件处理
    if event.type == 'HandoffMessage':
        log_handoff(event.from_agent, event.to_agent)
```

### 7.3 MCP工具调用机制
```python
# 使用StreamableHttp与MCP服务器通信的示例
class MCPService:
    def __init__(self, config):
        self.servers = {}
        for server_config in config['mcpServers']:
            self.servers[server_config['name']] = StreamableHttp(
                base_url=server_config['url'],
                headers=server_config.get('headers', {})
            )
    
    async def discover_tools(self, server_name):
        # 通过HTTP获取服务器提供的工具列表
        response = await self.servers[server_name].get('/tools')
        return response.json()
    
    async def call_tool(self, server_name, tool_name, params):
        # 通过HTTP调用具体的工具
        response = await self.servers[server_name].post(
            f'/tools/{tool_name}/invoke',
            json=params
        )
        return response.json()
```

### 7.4 断线重连机制
- WebSocket断开后，前端自动重连
- 重连成功后，根据最后接收的sequence获取遗漏的事件
- 保证事件的完整性和顺序性

## 8. 非功能性需求

### 8.1 性能要求
- API响应时间 < 200ms（不含AI调用）
- WebSocket延迟 < 50ms
- 支持100+并发对话
- 事件批量写入优化（每秒1000+事件）
- MySQL连接池配置（最小10，最大50）

### 8.2 可用性要求
- 响应式设计，支持1920x1080以上分辨率
- 清晰的操作反馈和错误提示
- 支持暗色/亮色主题切换
- 关键操作的二次确认

### 8.3 安全性要求
- JWT Token认证（过期时间24小时）
- API请求频率限制（每用户每分钟100次）
- SQL注入防护（使用ORM参数化查询）
- XSS防护（React默认转义）
- 敏感信息（MCP服务器凭证）加密存储

### 8.4 可维护性
- 完整的日志记录（使用Python logging）
- 错误追踪和监控
- 数据库迁移脚本管理
- API文档自动生成（FastAPI内置）

## 9. 开发阶段规划

### Phase 1: 核心框架（1周）
- FastAPI项目搭建和MySQL集成
- 用户认证系统
- Agent和Team的CRUD接口
- 基础前端框架和路由

### Phase 2: MAS集成（1周）
- Autogen集成和Swarm实现
- MCP服务器连接和工具管理
- 基础的Team运行功能
- 事件存储机制

### Phase 3: 实时通信（1周）
- WebSocket实时事件推送
- 流式输出处理
- 对话回放功能
- 前端实时展示优化

### Phase 4: 用户体验（1周）
- UI美化和交互优化
- 错误处理和用户提示完善
- 性能优化
- 文档编写和部署脚本

## 10. 技术实现要点

### 10.1 项目结构
```
agentput/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── users.py
│   │   │   │   ├── agents.py
│   │   │   │   ├── teams.py
│   │   │   │   ├── conversations.py
│   │   │   │   └── tools.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── agent.py
│   │   │   ├── team.py
│   │   │   └── conversation.py
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── autogen_service.py
│   │   │   ├── mcp_service.py
│   │   │   └── event_service.py
│   │   └── websocket/
│   │       └── manager.py
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── configs/
│   └── mcps.json
├── migrations/
├── requirements.txt
└── docker-compose.yml
```

### 10.2 关键技术实现
1. **MCP集成**：
   - 所有MCP服务器通过HTTP协议访问（不是subprocess）
   - 统一使用StreamableHttp处理所有MCP通信
   - 支持HTTP长连接和流式响应
   - 动态发现和注册MCP服务器提供的工具
2. **异步执行**：使用asyncio.create_task处理Team运行
3. **事件批处理**：使用队列批量写入事件，减少数据库压力
4. **WebSocket管理**：使用ConnectionManager维护活跃连接
5. **前端状态管理**：使用Redux管理复杂的对话状态

## 11. 部署和运维

### 11.1 部署要求
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Redis（可选，用于缓存）
- 最低2核4G内存

### 11.2 环境变量配置
```bash
# 数据库配置
DATABASE_URL=mysql+aiomysql://user:password@localhost/agentput
DATABASE_POOL_SIZE=20

# 安全配置
SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# MCP配置
MCP_CONFIG_PATH=/app/configs/mcps.json
MCP_TIMEOUT=30

# API配置
API_PREFIX=/api
CORS_ORIGINS=["http://localhost:3000"]
```

### 11.3 Docker部署
提供完整的docker-compose.yml，包含：
- FastAPI应用容器
- MySQL数据库容器
- Nginx反向代理（可选）
- 持久化存储卷配置

## 12. Claude Code 实现指导

### 12.1 MCP集成重点
- **不要使用subprocess**：MCP服务器是独立运行的HTTP服务，不是由我们的应用启动
- **统一使用StreamableHttp**：所有与MCP服务器的通信都通过HTTP协议
- **服务发现流程**：
  1. 读取mcps.json配置文件
  2. 对每个MCP服务器建立HTTP连接
  3. 调用服务器的工具发现接口获取可用工具列表
  4. 将工具注册到系统中供Agent使用

### 12.2 Autogen集成要点
- 所有Agent都继承自`AssistantAgent`
- Team统一使用`Swarm`类
- handoffs定义在Agent级别，Swarm会自动处理转交逻辑
- 使用Autogen的事件系统捕获所有协作事件

### 12.3 实现顺序建议
1. 先实现基础CRUD，不包含实际的Agent运行
2. 集成Autogen，实现简单的Team运行（不含MCP工具）
3. 添加StreamableHttp和MCP工具支持
4. 实现WebSocket实时事件流
5. 完善前端交互和对话回放功能