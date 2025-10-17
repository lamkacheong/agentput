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
import { teamAPI, agentAPI } from '@/services/api'
import type { AgentListItem } from '@/types'

export default function TeamEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [availableAgents, setAvailableAgents] = useState<AgentListItem[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [formValues, setFormValues] = useState<any>({})

  const isEdit = !!id

  useEffect(() => {
    loadAvailableAgents()
    if (isEdit) {
      loadTeam()
    }
  }, [id])

  const loadAvailableAgents = async () => {
    try {
      const data = await agentAPI.getAvailable()
      setAvailableAgents(data)
    } catch (error: any) {
      Toast.error('加载可用 Agent 失败')
    }
  }

  const loadTeam = async () => {
    setLoading(true)
    try {
      const data = await teamAPI.get(id!)
      setFormValues({
        name: data.name,
        description: data.description,
        agents: data.agents,
        entry_agent: data.entry_agent,
      })
      setSelectedAgents(data.agents)
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '加载失败')
      navigate('/teams')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    setSaving(true)
    try {
      if (isEdit) {
        await teamAPI.update(id!, values)
        Toast.success('更新成功')
      } else {
        await teamAPI.create(values)
        Toast.success('创建成功')
      }
      navigate('/teams')
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

  const selectedAgentOptions = availableAgents.filter((agent) =>
    selectedAgents.includes(agent.id)
  )

  return (
    <Card
      title={isEdit ? '编辑 Team' : '创建 Team'}
      headerExtraContent={
        <Button
          icon={<IconArrowLeft />}
          onClick={() => navigate('/teams')}
        >
          返回列表
        </Button>
      }
    >
      <Form onSubmit={handleSubmit} labelPosition="left" labelWidth={120} initValues={formValues} getFormApi={(api) => {
          // 保存 form API 引用
          (window as any).__teamFormApi = api;
        }}>
        <Form.Input
          field="name"
          label="Team 名称"
          placeholder="请输入 Team 名称"
          rules={[{ required: true, message: '请输入 Team 名称' }]}
          style={{ width: '100%' }}
        />

        <Form.TextArea
          field="description"
          label="描述"
          placeholder="请输入 Team 描述"
          maxCount={200}
          style={{ width: '100%' }}
        />

        <Form.Select
          field="agents"
          label="Team Agents"
          placeholder="选择 Agent"
          multiple
          filter
          rules={[{ required: true, message: '请选择至少一个 Agent' }]}
          style={{ width: '100%' }}
          onChange={(value) => {
            setSelectedAgents(value as string[])
            // 如果当前选择的 entry_agent 不在新选择的 agents 中，清空它
            const formApi = (window as any).__teamFormApi;
            if (formApi) {
              const currentEntryAgent = formApi.getValue('entry_agent')
              if (currentEntryAgent && !(value as string[]).includes(currentEntryAgent)) {
                formApi.setValue('entry_agent', undefined)
              }
            }
          }}
        >
          {availableAgents.map((agent) => (
            <Select.Option key={agent.id} value={agent.id}>
              {agent.name}
            </Select.Option>
          ))}
        </Form.Select>

        <Form.Select
          field="entry_agent"
          label="入口 Agent"
          placeholder="选择入口 Agent"
          rules={[{ required: true, message: '请选择入口 Agent' }]}
          style={{ width: '100%' }}
          disabled={selectedAgents.length === 0}
        >
          {selectedAgentOptions.map((agent) => (
            <Select.Option key={agent.id} value={agent.id}>
              {agent.name}
            </Select.Option>
          ))}
        </Form.Select>

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
            <Button onClick={() => navigate('/teams')}>取消</Button>
          </Space>
        </div>
      </Form>
    </Card>
  )
}
