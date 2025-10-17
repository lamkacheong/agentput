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
import { teamAPI } from '@/services/api'
import type { TeamListItem } from '@/types'

export default function TeamList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState<TeamListItem[]>([])

  const loadTeams = async () => {
    setLoading(true)
    try {
      const data = await teamAPI.list()
      setTeams(data)
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await teamAPI.delete(id)
      Toast.success('删除成功')
      loadTeams()
    } catch (error: any) {
      Toast.error(error.response?.data?.detail || '删除失败')
    }
  }

  const columns = [
    {
      title: 'Team 名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Agent 数量',
      dataIndex: 'agent_count',
      key: 'agent_count',
      render: (count: number) => (
        <Tag color="blue" size="small">
          {count} 个 Agent
        </Tag>
      ),
    },
    {
      title: '入口 Agent',
      dataIndex: 'entry_agent',
      key: 'entry_agent',
      render: (text: string) => (
        <Tag color="green" size="small">
          {text}
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
      render: (_: any, record: TeamListItem) => (
        <Space>
          <Button
            icon={<IconEdit />}
            size="small"
            onClick={() => navigate(`/teams/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个 Team 吗？"
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
      title="Team 管理"
      headerExtraContent={
        <Button
          icon={<IconPlus />}
          theme="solid"
          style={{ backgroundColor: '#4d53e8' }}
          onClick={() => navigate('/teams/new')}
        >
          创建 Team
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={teams}
        loading={loading}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
      />
    </Card>
  )
}
