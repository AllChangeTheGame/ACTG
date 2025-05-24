from sqlalchemy import Column, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from .base import Base


class UserLocation(Base):
    __tablename__ = "user_location_log"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=False)
    velocity = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    logged_time = Column(DateTime, nullable=False)


class LocationShareRequest(Base):
    __tablename__ = "location_share_request"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    request_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    location_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)

    request_start_time = Column(DateTime, nullable=False)
    request_end_time = Column(DateTime, nullable=False)
