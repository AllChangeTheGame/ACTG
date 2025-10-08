from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.wallet import ReasonCategory

from .base import ModelBase


class WalletBalance(BaseModel):
    team_id: UUID
    balance: Decimal

    model_config = ConfigDict(from_attributes=True)


class WalletTransactionCreate(BaseModel):
    amount: Decimal = Field(..., ge=-1000, le=1000, description="Amount to add (positive) or deduct (negative)")
    reason_category: ReasonCategory
    reason: Optional[str] = Field(None, max_length=500, description="Required when reason_category is OTHER")

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, v, info):
        reason_category = info.data.get("reason_category")
        if reason_category == ReasonCategory.OTHER and not v:
            raise ValueError("reason is required when reason_category is OTHER")
        if reason_category != ReasonCategory.OTHER and v:
            raise ValueError("reason should only be provided when reason_category is OTHER")
        return v

    model_config = ConfigDict(from_attributes=True)


class WalletTransaction(ModelBase):
    team_id: UUID
    user_id: UUID
    amount: Decimal
    reason_category: ReasonCategory
    reason: Optional[str]
    wallet_balance_after: Decimal
    create_time: datetime

    model_config = ConfigDict(from_attributes=True)


class ReasonCategoryResponse(BaseModel):
    value: str
    label: str
    type: str

    model_config = ConfigDict(from_attributes=True)
