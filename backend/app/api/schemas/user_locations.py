from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.api.schemas.base import ModelBase


class UserLocation(ModelBase):
    user_id: UUID
    latitude: float
    longitude: float
    velocity: float
    accuracy: float
    logged_time: datetime
    is_active: bool = True


class LocationShareRequest(BaseModel):
    request_team_id: UUID
