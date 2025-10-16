from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.agent import Agent
from backend.app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentListResponse
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[AgentListResponse])
async def get_agents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取Agent列表"""
    result = await db.execute(
        select(Agent)
        .offset(skip)
        .limit(limit)
        .order_by(Agent.created_at.desc())
    )
    agents = result.scalars().all()

    # 构造响应
    response = []
    for agent in agents:
        response.append(AgentListResponse(
            id=agent.id,
            name=agent.name,
            created_by=agent.created_by,
            created_at=agent.created_at,
            handoff_count=len(agent.handoffs) if agent.handoffs else 0,
            tool_count=len(agent.tools) if agent.tools else 0
        ))

    return response


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent_in: AgentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建新Agent"""
    # 检查名称是否已存在
    result = await db.execute(select(Agent).where(Agent.name == agent_in.name))
    existing_agent = result.scalar_one_or_none()

    if existing_agent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Agent名称'{agent_in.name}'已存在"
        )

    # 创建Agent
    db_agent = Agent(
        name=agent_in.name,
        system_message=agent_in.system_message,
        handoffs=agent_in.handoffs,
        tools=agent_in.tools,
        created_by=current_user.id
    )

    db.add(db_agent)
    await db.commit()
    await db.refresh(db_agent)

    return db_agent


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取Agent详情"""
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent不存在"
        )

    return agent


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    agent_update: AgentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新Agent"""
    # 查找Agent
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent不存在"
        )

    # 如果更新名称，检查是否重复
    if agent_update.name and agent_update.name != agent.name:
        result = await db.execute(select(Agent).where(Agent.name == agent_update.name))
        existing_agent = result.scalar_one_or_none()

        if existing_agent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Agent名称'{agent_update.name}'已存在"
            )
        agent.name = agent_update.name

    # 更新其他字段
    if agent_update.system_message is not None:
        agent.system_message = agent_update.system_message
    if agent_update.handoffs is not None:
        agent.handoffs = agent_update.handoffs
    if agent_update.tools is not None:
        agent.tools = agent_update.tools

    await db.commit()
    await db.refresh(agent)

    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除Agent"""
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent不存在"
        )

    await db.delete(agent)
    await db.commit()

    return None


@router.get("/available/list", response_model=List[AgentListResponse])
async def get_available_agents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取可用于handoff的Agent列表"""
    result = await db.execute(
        select(Agent).order_by(Agent.name)
    )
    agents = result.scalars().all()

    response = []
    for agent in agents:
        response.append(AgentListResponse(
            id=agent.id,
            name=agent.name,
            created_by=agent.created_by,
            created_at=agent.created_at,
            handoff_count=len(agent.handoffs) if agent.handoffs else 0,
            tool_count=len(agent.tools) if agent.tools else 0
        ))

    return response
