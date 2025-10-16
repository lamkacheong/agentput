from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from backend.app.core.database import Base
import uuid


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, unique=True, index=True)
    system_message = Column(Text, nullable=False)
    handoffs = Column(JSON, default=list)  # ["agent_name1", "agent_name2"]
    tools = Column(JSON, default=list)  # ["tool_name1", "tool_name2"]
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Agent(id={self.id}, name={self.name})>"
