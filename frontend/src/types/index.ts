// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

// Agent 相关类型
export interface Agent {
  id: string
  name: string
  system_message: string
  handoffs: string[]
  tools: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface AgentListItem {
  id: string
  name: string
  created_by: string
  created_at: string
  handoff_count: number
  tool_count: number
}

export interface AgentCreate {
  name: string
  system_message: string
  handoffs?: string[]
  tools?: string[]
}

export interface AgentUpdate {
  name?: string
  system_message?: string
  handoffs?: string[]
  tools?: string[]
}

// Team 相关类型
export interface Team {
  id: string
  name: string
  description: string
  agents: string[]
  entry_agent: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface TeamListItem {
  id: string
  name: string
  description: string
  agent_count: number
  entry_agent: string
  created_at: string
}

export interface TeamCreate {
  name: string
  description?: string
  agents: string[]
  entry_agent: string
}

export interface TeamUpdate {
  name?: string
  description?: string
  agents?: string[]
  entry_agent?: string
}

// Conversation 相关类型
export interface Conversation {
  id: string
  user_id: string
  team_id: string
  task: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  started_at?: string
  completed_at?: string
  created_at: string
}
