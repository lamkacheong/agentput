import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Nav, Avatar, Dropdown, Button } from '@douyinfe/semi-ui'
import {
  IconHome,
  IconUserGroup,
  IconComment,
  IconExit,
  IconUser,
  IconSetting,
} from '@douyinfe/semi-icons'
import { useAuthStore } from '@/store'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      itemKey: '/',
      text: '首页',
      icon: <IconHome />,
    },
    {
      itemKey: '/agents',
      text: 'Agent 管理',
      icon: <IconUserGroup />,
    },
    {
      itemKey: '/teams',
      text: 'Team 管理',
      icon: <IconSetting />,
    },
    {
      itemKey: '/conversations',
      text: '对话记录',
      icon: <IconComment />,
    },
  ]

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        style={{
          backgroundColor: 'var(--semi-color-bg-1)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--semi-color-border)',
            fontSize: 20,
            fontWeight: 600,
            color: '#4d53e8',
          }}
        >
          {!collapsed && 'AgentPut'}
          {collapsed && 'AP'}
        </div>
        <Nav
          selectedKeys={[location.pathname]}
          items={menuItems}
          onSelect={(data) => navigate(data.itemKey as string)}
          style={{ height: 'calc(100% - 64px)' }}
          isCollapsed={collapsed}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: 'var(--semi-color-bg-1)',
            borderBottom: '1px solid var(--semi-color-border)',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <Button
            theme="borderless"
            icon={<IconSetting />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Dropdown
            trigger="click"
            position="bottomRight"
            render={
              <Dropdown.Menu>
                <Dropdown.Item icon={<IconUser />}>
                  {user?.name || '用户'}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item icon={<IconExit />} onClick={handleLogout}>
                  退出登录
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <Avatar size="small" style={{ backgroundColor: '#4d53e8' }}>
              {user?.name?.[0] || 'U'}
            </Avatar>
          </Dropdown>
        </Header>

        <Content
          style={{
            padding: 24,
            backgroundColor: 'var(--semi-color-bg-0)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
