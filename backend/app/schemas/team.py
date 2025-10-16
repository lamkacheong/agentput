from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    agents: List[str] = Field(..., min_items=1)  # Agent IDs
    entry_agent: str = Field(..., min_length=1)  # Agent ID


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    agents: Optional[List[str]] = Field(None, min_items=1)
    entry_agent: Optional[str] = Field(None, min_length=1)


class TeamResponse(TeamBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamListResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    agent_count: int = 0
    entry_agent: str
    created_at: datetime

    class Config:
        from_attributes = True
