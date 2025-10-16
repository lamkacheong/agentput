"""
数据库初始化脚本
直接创建所有表结构
"""
import asyncio
import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from backend.app.core.database import engine, Base
from backend.app.models import User, Agent, Team, Conversation, Event


async def init_database():
    """初始化数据库"""
    print("开始创建数据库表...")

    async with engine.begin() as conn:
        # 删除所有表（谨慎使用！）
        await conn.run_sync(Base.metadata.drop_all)
        print("已删除旧表")

        # 创建所有表
        await conn.run_sync(Base.metadata.create_all)
        print("已创建新表")

    print("数据库初始化完成！")


async def main():
    await init_database()


if __name__ == "__main__":
    asyncio.run(main())
