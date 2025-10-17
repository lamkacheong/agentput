import axios from 'axios'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  Agent,
  AgentListItem,
  AgentCreate,
  AgentUpdate,
  Team,
  TeamListItem,
  TeamCreate,
  TeamUpdate,
  Conversation,
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 用户相关 API
export const userAPI = {
  register: (data: RegisterRequest) => api.post<any, User>('/users/register', data),
  login: (data: LoginRequest) => api.post<any, TokenResponse>('/users/login', data),
  getProfile: () => api.get<any, User>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<any, User>('/users/profile', data),
}

// Agent 相关 API
export const agentAPI = {
  list: (params?: { skip?: number; limit?: number }) =>
    api.get<any, AgentListItem[]>('/agents', { params }),
  get: (id: string) => api.get<any, Agent>(`/agents/${id}`),
  create: (data: AgentCreate) => api.post<any, Agent>('/agents', data),
  update: (id: string, data: AgentUpdate) => api.put<any, Agent>(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`),
  getAvailable: () => api.get<any, AgentListItem[]>('/agents/available/list'),
}

// Team 相关 API
export const teamAPI = {
  list: (params?: { skip?: number; limit?: number }) =>
    api.get<any, TeamListItem[]>('/teams', { params }),
  get: (id: string) => api.get<any, Team>(`/teams/${id}`),
  create: (data: TeamCreate) => api.post<any, Team>('/teams', data),
  update: (id: string, data: TeamUpdate) => api.put<any, Team>(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
}

// Conversation 相关 API
export const conversationAPI = {
  list: () => api.get<any, Conversation[]>('/conversations'),
  get: (id: string) => api.get<any, Conversation>(`/conversations/${id}`),
  create: (data: { team_id: string; task: string }) =>
    api.post<any, Conversation>('/conversations', data),
  cancel: (id: string) => api.post(`/conversations/${id}/cancel`),
  delete: (id: string) => api.delete(`/conversations/${id}`),
}

export default api
