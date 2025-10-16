from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class AgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    system_message: str = Field(..., min_length=1)
    handoffs: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    system_message: Optional[str] = Field(None, min_length=1)
    handoffs: Optional[List[str]] = None
    tools: Optional[List[str]] = None


class AgentResponse(AgentBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AgentListResponse(BaseModel):
    id: str
    name: str
    created_by: Optional[str] = None
    created_at: datetime
    handoff_count: int = 0
    tool_count: int = 0

    class Config:
        from_attributes = True
