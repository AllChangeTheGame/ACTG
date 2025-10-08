from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.distance_adjustments import AdjustmentReason


class DistanceAdjustmentBase(BaseModel):
    adjustment_km: int
    reason_category: AdjustmentReason
    reason: str | None = None


class DistanceAdjustmentCreate(DistanceAdjustmentBase):
    pass


class DistanceAdjustment(DistanceAdjustmentBase):
    id: UUID
    team_id: UUID
    user_id: UUID
    create_time: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class ExchangeDistanceRequest(BaseModel):
    pass  # No input needed - always 200km for 100 euros


class ExchangeDistanceResponse(BaseModel):
    adjustment_id: UUID
    adjustment_km: int
    wallet_transaction_id: UUID
    wallet_amount: float
    new_wallet_balance: float
