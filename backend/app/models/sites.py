from sqlalchemy import Column, Float, Integer, String
from sqlalchemy.orm import relationship

from .base import Base


class BonusSite(Base):
    __tablename__ = "bonus_sites"
    site_name = Column(String(50), nullable=False, unique=True)
    city = Column(String(50), nullable=False)
    country = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    site_value = Column(Integer, nullable=False)

    claimed_by_teams = relationship("BonusSiteClaim", back_populates="claimed_bonus_site", lazy="joined")
