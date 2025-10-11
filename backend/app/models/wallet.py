import enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base
from .utils import get_utc_time


class ReasonCategory(enum.Enum):
    CHALLENGE_CARD = ("challenge_card", "Challenge Card", "add")
    TRAIN_TICKETS = ("train_tickets", "Train Tickets", "deduct")
    NEW_COUNTRY = ("new_country", "New Country", "add")
    NEW_CAPITAL = ("new_capital", "New Capital", "add")
    DELAY_CANCELLATION = ("delay_cancellation", "Delay / Cancellation", "add")
    TIE_BREAK = ("tie_break", "Tie Break", "add")
    SHOP_PURCHASE = ("shop_purchase", "Shop Purchase", "deduct")
    STEAL_CARD = ("steal_card", "Steal Card", "both")
    DISTANCE_EXCHANGE = ("distance_exchange", "Distance Exchange", "add")
    OTHER = ("other", "Other", "both")

    def __init__(self, value, label, transaction_type):
        self._value_ = value
        self.label = label
        self.transaction_type = transaction_type


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    reason_category = Column(Enum(ReasonCategory), nullable=False)
    reason = Column(String(500))
    wallet_balance_after = Column(Numeric(precision=10, scale=2), nullable=False)

    team = relationship("Team", back_populates="wallet_transactions")
    user = relationship("User")

    create_time = Column(DateTime, default=get_utc_time, nullable=False)
    last_updated_time = Column(DateTime, default=get_utc_time, nullable=False, onupdate=func.now())
    is_active = Column(Boolean, default=True, nullable=False)
