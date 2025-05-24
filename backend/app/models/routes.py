from sqlalchemy import Column, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base


class Route(Base):
    __tablename__ = "routes"
    name = Column(String(200), nullable=False, unique=True)
    distance = Column(Float, nullable=False)

    # Start city
    start_city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id"), nullable=False)
    start_city = relationship("City", foreign_keys=[start_city_id])

    # End city
    end_city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id"), nullable=False)
    end_city = relationship("City", foreign_keys=[end_city_id])

    # Add relationship to link routes to a team (many-to-one)
    claimed_by_teams = relationship("RouteClaim", back_populates="claimed_route", lazy="joined")
