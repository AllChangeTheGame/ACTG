from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base
from .utils import get_utc_time


class ScrewCardDraw(Base):
    __tablename__ = "screw_card_draws"

    screw_card_id = Column(UUID(as_uuid=True), ForeignKey("screw_cards.id"), primary_key=True)
    team_id = Column(ForeignKey("teams.id"), primary_key=True)

    drawn_by_team = relationship("Team")
    screw_card = relationship("ScrewCard")

    create_time = Column(DateTime, default=get_utc_time, nullable=False)
    last_updated_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    last_updated_user = relationship("User")


class ScrewCard(Base):
    __tablename__ = "screw_cards"
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    is_active = Column(Boolean, nullable=False)
