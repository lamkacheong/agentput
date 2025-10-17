import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { userAPI } from '@/services/api'
import MainLayout from '@/components/MainLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import AgentList from '@/pages/Agent/AgentList'
import AgentEdit from '@/pages/Agent/AgentEdit'
import TeamList from '@/pages/Team/TeamList'
import TeamEdit from '@/pages/Team/TeamEdit'
import ConversationList from '@/pages/Conversation/ConversationList'

function App() {
  const { isAuthenticated, setUser } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated()) {
      userAPI.getProfile().then(setUser).catch(() => {
        useAuthStore.getState().logout()
      })
    }
  }, [isAuthenticated, setUser])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          isAuthenticated() ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="agents" element={<AgentList />} />
        <Route path="agents/new" element={<AgentEdit />} />
        <Route path="agents/:id" element={<AgentEdit />} />
        <Route path="teams" element={<TeamList />} />
        <Route path="teams/new" element={<TeamEdit />} />
        <Route path="teams/:id" element={<TeamEdit />} />
        <Route path="conversations" element={<ConversationList />} />
      </Route>
    </Routes>
  )
}

export default App
