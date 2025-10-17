import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Card, Toast } from '@douyinfe/semi-ui'
import { userAPI } from '@/services/api'
import { useAuthStore } from '@/store'

export default function Login() {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const tokenData = await userAPI.login(values)
      setToken(tokenData.access_token)

      const userData = await userAPI.getProfile()
      setUser(userData)

      Toast.success('登录成功')
      navigate('/')
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          padding: 24,
        }}
        shadows="always"
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 600, color: '#4d53e8', marginBottom: 8 }}>
            AgentPut
          </h1>
          <p style={{ color: 'var(--semi-color-text-2)' }}>
            多智能体协作平台
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Input
            field="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          />
          <Form.Input
            field="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
          <Button
            htmlType="submit"
            type="primary"
            theme="solid"
            block
            size="large"
            loading={loading}
            style={{
              marginTop: 16,
              backgroundColor: '#4d53e8',
            }}
          >
            登录
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: 'var(--semi-color-text-2)' }}>还没有账号？</span>
          <Link
            to="/register"
            style={{ color: '#4d53e8', marginLeft: 8, textDecoration: 'none' }}
          >
            立即注册
          </Link>
        </div>
      </Card>
    </div>
  )
}
