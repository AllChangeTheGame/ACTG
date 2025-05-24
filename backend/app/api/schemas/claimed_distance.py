from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ClaimedDistanceBase(BaseModel):
    team_id: UUID
    team_name: str
    claimed_distance: int


class ClaimedDistance(ClaimedDistanceBase):
    model_config = ConfigDict(from_attributes=True)
