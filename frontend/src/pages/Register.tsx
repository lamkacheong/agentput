import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Card, Toast } from '@douyinfe/semi-ui'
import { userAPI } from '@/services/api'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formApi, setFormApi] = useState<any>(null)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await userAPI.register(values)
      Toast.success('注册成功，请登录')
      navigate('/login')
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '注册失败')
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
            注册账号
          </h1>
          <p style={{ color: 'var(--semi-color-text-2)' }}>
            创建你的 AgentPut 账号
          </p>
        </div>

        <Form onSubmit={handleSubmit} getFormApi={(api) => setFormApi(api)}>
          <Form.Input
            field="name"
            label="用户名"
            placeholder="请输入用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          />
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
            placeholder="请输入密码（至少6位）"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
            onChange={() => {
              // 当密码改变时，重新验证确认密码字段
              if (formApi) {
                formApi.validate(['confirmPassword'])
              }
            }}
          />
          <Form.Input
            field="confirmPassword"
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
            rules={[
              { required: true, message: '请确认密码' },
              {
                validator: (_rule, value) => {
                  const password = formApi?.getValue('password')
                  if (value && password && value !== password) {
                    return new Error('两次密码不一致')
                  }
                  return true
                },
              },
            ]}
            validateStatus={
              formApi?.getTouched('confirmPassword') &&
              formApi?.getValue('confirmPassword') &&
              formApi?.getValue('password') &&
              formApi?.getValue('confirmPassword') !== formApi?.getValue('password')
                ? 'error'
                : undefined
            }
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
            注册
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: 'var(--semi-color-text-2)' }}>已有账号？</span>
          <Link
            to="/login"
            style={{ color: '#4d53e8', marginLeft: 8, textDecoration: 'none' }}
          >
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  )
}
