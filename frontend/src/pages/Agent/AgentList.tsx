import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Card,
  Toast,
  Popconfirm,
  Tag,
  Space,
} from '@douyinfe/semi-ui'
import { IconPlus, IconEdit, IconDelete } from '@douyinfe/semi-icons'
import { agentAPI } from '@/services/api'
import type { AgentListItem } from '@/types'

export default function AgentList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<AgentListItem[]>([])

  const loadAgents = async () => {
    setLoading(true)
    try {
      const data = await agentAPI.list()
      setAgents(data)
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await agentAPI.delete(id)
      Toast.success('删除成功')
      loadAgents()
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '删除失败')
    }
  }

  const columns = [
    {
      title: 'Agent 名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '工具数量',
      dataIndex: 'tool_count',
      key: 'tool_count',
      render: (count: number) => (
        <Tag color="blue" size="small">
          {count} 个工具
        </Tag>
      ),
    },
    {
      title: 'Handoff 数量',
      dataIndex: 'handoff_count',
      key: 'handoff_count',
      render: (count: number) => (
        <Tag color="green" size="small">
          {count} 个转交
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AgentListItem) => (
        <Space>
          <Button
            icon={<IconEdit />}
            size="small"
            onClick={() => navigate(`/agents/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个 Agent 吗？"
            content="此操作不可恢复"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              icon={<IconDelete />}
              size="small"
              type="danger"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="Agent 管理"
      headerExtraContent={
        <Button
          icon={<IconPlus />}
          theme="solid"
          style={{ backgroundColor: '#4d53e8' }}
          onClick={() => navigate('/agents/new')}
        >
          创建 Agent
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={agents}
        loading={loading}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
      />
    </Card>
  )
}
