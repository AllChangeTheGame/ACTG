from sqlalchemy import Boolean, Column, Float, String

from .base import Base


class City(Base):
    __tablename__ = "cities"
    location_name = Column(String(50), nullable=False, unique=True)
    name = Column(String(50), nullable=False)
    country = Column(String(50), nullable=False)
    is_starter_city = Column(Boolean, default=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
