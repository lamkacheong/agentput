from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from backend.app.models.conversation import ConversationStatus


class ConversationBase(BaseModel):
    task: str = Field(..., min_length=1)


class ConversationCreate(ConversationBase):
    team_id: str = Field(..., min_length=1)


class ConversationResponse(ConversationBase):
    id: str
    user_id: str
    team_id: str
    status: ConversationStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    id: str
    task: str
    team_id: str
    status: ConversationStatus
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
