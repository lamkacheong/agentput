import { useNavigate } from 'react-router-dom'
import { Card, Button, Empty } from '@douyinfe/semi-ui'
import { IconPlus, IconUserGroup, IconSetting } from '@douyinfe/semi-icons'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>欢迎使用 AgentPut</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
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
          style={{ height: 300 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <IconUserGroup size="extra-large" style={{ color: '#4d53e8', marginBottom: 16 }} />
            <p style={{ color: 'var(--semi-color-text-2)', marginBottom: 16 }}>
              创建和管理你的智能体
            </p>
            <Button onClick={() => navigate('/agents')}>查看所有 Agent</Button>
          </div>
        </Card>

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
          style={{ height: 300 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <IconSetting size="extra-large" style={{ color: '#4d53e8', marginBottom: 16 }} />
            <p style={{ color: 'var(--semi-color-text-2)', marginBottom: 16 }}>
              组建智能体团队协作
            </p>
            <Button onClick={() => navigate('/teams')}>查看所有 Team</Button>
          </div>
        </Card>
      </div>

      <Card title="快速开始" style={{ marginTop: 24 }}>
        <Empty
          image={<IconSetting size="extra-large" />}
          title="开始创建你的第一个智能体"
          description="通过创建 Agent 和 Team，让多个智能体协同工作"
        />
      </Card>
    </div>
  )
}
