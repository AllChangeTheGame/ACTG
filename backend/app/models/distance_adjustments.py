import enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base
from .utils import get_utc_time


class AdjustmentReason(enum.Enum):
    DISTANCE_FOR_MONEY = ("distance_for_money", "Exchanged Distance for Money")
    OTHER = ("other", "Other")

    def __init__(self, value, label):
        self._value_ = value
        self.label = label


class DistanceAdjustment(Base):
    __tablename__ = "distance_adjustments"
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    adjustment_km = Column(Integer, nullable=False)  # Can be positive or negative
    reason_category = Column(Enum(AdjustmentReason), nullable=False)
    reason = Column(String(500))

    team = relationship("Team", back_populates="distance_adjustments")
    user = relationship("User")

    create_time = Column(DateTime, default=get_utc_time, nullable=False)
    last_updated_time = Column(DateTime, default=get_utc_time, nullable=False, onupdate=func.now())
    is_active = Column(Boolean, default=True, nullable=False)
