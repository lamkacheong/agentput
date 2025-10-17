import { Card, Empty } from '@douyinfe/semi-ui'
import { IconComment } from '@douyinfe/semi-icons'

export default function ConversationList() {
  return (
    <Card title="对话记录">
      <Empty
        image={<IconComment size="extra-large" />}
        title="暂无对话记录"
        description="创建 Team 并开始对话后，记录将显示在这里"
      />
    </Card>
  )
}
