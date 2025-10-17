import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Form,
  Button,
  Card,
  Toast,
  Select,
  Space,
  Spin,
} from '@douyinfe/semi-ui'
import { IconSave, IconArrowLeft } from '@douyinfe/semi-icons'
import Editor from '@monaco-editor/react'
import { agentAPI } from '@/services/api'
import type { AgentListItem } from '@/types'

export default function AgentEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [availableAgents, setAvailableAgents] = useState<AgentListItem[]>([])
  const [systemMessage, setSystemMessage] = useState('')
  const [formValues, setFormValues] = useState<any>({})

  const isEdit = !!id

  useEffect(() => {
    loadAvailableAgents()
    if (isEdit) {
      loadAgent()
    }
  }, [id])

  const loadAvailableAgents = async () => {
    try {
      const data = await agentAPI.getAvailable()
      setAvailableAgents(data.filter((a) => a.id !== id))
    } catch (error: any) {
      Toast.error('加载可用 Agent 失败')
    }
  }

  const loadAgent = async () => {
    setLoading(true)
    try {
      const data = await agentAPI.get(id!)
      setFormValues({
        name: data.name,
        handoffs: data.handoffs || [],
        tools: data.tools || [],
      })
      setSystemMessage(data.system_message)
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '加载失败')
      navigate('/agents')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    if (!systemMessage.trim()) {
      Toast.warning('请输入 System Message')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...values,
        system_message: systemMessage,
      }

      if (isEdit) {
        await agentAPI.update(id!, payload)
        Toast.success('更新成功')
      } else {
        await agentAPI.create(payload)
        Toast.success('创建成功')
      }
      navigate('/agents')
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Card
      title={isEdit ? '编辑 Agent' : '创建 Agent'}
      headerExtraContent={
        <Button
          icon={<IconArrowLeft />}
          onClick={() => navigate('/agents')}
        >
          返回列表
        </Button>
      }
    >
      <Form onSubmit={handleSubmit} labelPosition="left" labelWidth={120} initValues={formValues}>
        <Form.Input
          field="name"
          label="Agent 名称"
          placeholder="请输入 Agent 名称"
          rules={[{ required: true, message: '请输入 Agent 名称' }]}
          style={{ width: '100%' }}
        />

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            System Message <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ border: '1px solid var(--semi-color-border)', borderRadius: 4 }}>
            <Editor
              height="300px"
              defaultLanguage="markdown"
              value={systemMessage}
              onChange={(value) => setSystemMessage(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
              }}
            />
          </div>
          <p style={{ color: 'var(--semi-color-text-2)', fontSize: 12, marginTop: 4 }}>
            定义 Agent 的角色、能力和行为准则
          </p>
        </div>

        <Form.Select
          field="handoffs"
          label="Handoffs"
          placeholder="选择可转交的 Agent"
          multiple
          filter
          style={{ width: '100%' }}
        >
          {availableAgents.map((agent) => (
            <Select.Option key={agent.id} value={agent.name}>
              {agent.name}
            </Select.Option>
          ))}
        </Form.Select>

        <Form.TagInput
          field="tools"
          label="Tools"
          placeholder="输入工具名称并回车"
          allowDuplicates={false}
          style={{ width: '100%' }}
        />

        <div style={{ marginTop: 24 }}>
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              theme="solid"
              icon={<IconSave />}
              loading={saving}
              style={{ backgroundColor: '#4d53e8' }}
            >
              {isEdit ? '保存' : '创建'}
            </Button>
            <Button onClick={() => navigate('/agents')}>取消</Button>
          </Space>
        </div>
      </Form>
    </Card>
  )
}
