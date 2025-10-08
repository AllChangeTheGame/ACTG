from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base
from .utils import get_utc_time


class RouteClaim(Base):
    __tablename__ = "routes_claim"
    route_id = Column(ForeignKey("routes.id"), primary_key=True)
    team_id = Column(ForeignKey("teams.id"), primary_key=True)

    claimed_route = relationship("Route", back_populates="claimed_by_teams")
    claimed_by_team = relationship("Team", back_populates="claimed_routes")

    create_time = Column(DateTime, default=get_utc_time, nullable=False)
    last_updated_time = Column(DateTime, default=get_utc_time, nullable=False, onupdate=func.now())
    last_updated_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    last_updated_user = relationship("User")
    is_active = Column(Boolean, default=True, nullable=False)


class BonusSiteClaim(Base):
    __tablename__ = "bonus_sites_claim"
    site_id = Column(ForeignKey("bonus_sites.id"), primary_key=True)
    team_id = Column(ForeignKey("teams.id"), primary_key=True)

    claimed_bonus_site = relationship("BonusSite", back_populates="claimed_by_teams")
    claimed_by_team = relationship("Team", back_populates="claimed_bonus_sites")

    create_time = Column(DateTime, default=get_utc_time, nullable=False)
    last_updated_time = Column(DateTime, default=get_utc_time, nullable=False, onupdate=func.now())
    last_updated_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    last_updated_user = relationship("User")
    is_active = Column(Boolean, default=True, nullable=False)


class Team(Base):
    __tablename__ = "teams"
    name = Column(String(100), nullable=False)
    wallet_euros = Column(Numeric(precision=10, scale=2), default=0)

    # Add foreign key to link users to a team
    users = relationship("User", back_populates="team")
    # Add relationship to link routes to a team (many-to-many)
    claimed_routes = relationship("RouteClaim", back_populates="claimed_by_team", lazy="joined")
    claimed_bonus_sites = relationship("BonusSiteClaim", back_populates="claimed_by_team", lazy="joined")
    wallet_transactions = relationship(
        "WalletTransaction", back_populates="team", order_by="desc(WalletTransaction.create_time)"
    )
    distance_adjustments = relationship("DistanceAdjustment", back_populates="team")


class User(Base):
    __tablename__ = "users"
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"))
    given_name = Column(String(100), nullable=False)
    family_name = Column(String(100), nullable=False)
    firebase_uid = Column(String(100), nullable=False)
    team = relationship("Team", back_populates="users")
