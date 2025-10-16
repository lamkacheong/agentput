from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Integer, Enum
from sqlalchemy.sql import func
from backend.app.core.database import Base
import enum
import uuid


class EventType(str, enum.Enum):
    TEXT_MESSAGE = "TextMessage"
    TOOL_CALL_REQUEST = "ToolCallRequestEvent"
    TOOL_CALL_EXECUTION = "ToolCallExecutionEvent"
    TOOL_CALL_SUMMARY = "ToolCallSummaryMessage"
    AGENT_MESSAGE_CHUNK = "AgentMessageChunk"
    HANDOFF_MESSAGE = "HandoffMessage"


class Event(Base):
    __tablename__ = "events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(Enum(EventType), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    agent_name = Column(String(100), nullable=True)
    data = Column(JSON, nullable=False)  # 事件的具体内容
    sequence = Column(Integer, nullable=False)  # 事件在对话中的顺序

    def __repr__(self):
        return f"<Event(id={self.id}, type={self.event_type}, sequence={self.sequence})>"
