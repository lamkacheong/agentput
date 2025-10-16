from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.team import Team
from backend.app.models.agent import Agent
from backend.app.schemas.team import TeamCreate, TeamUpdate, TeamResponse, TeamListResponse
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[TeamListResponse])
async def get_teams(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取Team列表"""
    result = await db.execute(
        select(Team)
        .offset(skip)
        .limit(limit)
        .order_by(Team.created_at.desc())
    )
    teams = result.scalars().all()

    # 构造响应
    response = []
    for team in teams:
        response.append(TeamListResponse(
            id=team.id,
            name=team.name,
            description=team.description,
            agent_count=len(team.agents) if team.agents else 0,
            entry_agent=team.entry_agent,
            created_at=team.created_at
        ))

    return response


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_in: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建新Team"""
    # 验证所有Agent ID是否存在
    for agent_id in team_in.agents:
        result = await db.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Agent ID '{agent_id}' 不存在"
            )

    # 验证entry_agent是否在agents列表中
    if team_in.entry_agent not in team_in.agents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="入口Agent必须在Team的Agent列表中"
        )

    # 创建Team
    db_team = Team(
        name=team_in.name,
        description=team_in.description,
        agents=team_in.agents,
        entry_agent=team_in.entry_agent,
        created_by=current_user.id
    )

    db.add(db_team)
    await db.commit()
    await db.refresh(db_team)

    return db_team


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取Team详情"""
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team不存在"
        )

    return team


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: str,
    team_update: TeamUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新Team"""
    # 查找Team
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team不存在"
        )

    # 验证agents
    if team_update.agents is not None:
        for agent_id in team_update.agents:
            result = await db.execute(select(Agent).where(Agent.id == agent_id))
            agent = result.scalar_one_or_none()
            if not agent:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Agent ID '{agent_id}' 不存在"
                )
        team.agents = team_update.agents

    # 验证entry_agent
    if team_update.entry_agent is not None:
        agents_list = team_update.agents if team_update.agents is not None else team.agents
        if team_update.entry_agent not in agents_list:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="入口Agent必须在Team的Agent列表中"
            )
        team.entry_agent = team_update.entry_agent

    # 更新其他字段
    if team_update.name is not None:
        team.name = team_update.name
    if team_update.description is not None:
        team.description = team_update.description

    await db.commit()
    await db.refresh(team)

    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除Team"""
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team不存在"
        )

    await db.delete(team)
    await db.commit()

    return None
