from datetime import datetime
from uuid import UUID

from app.api.schemas.base import ModelBase
from app.api.schemas.generic import ClaimInfo


class RouteBase(ModelBase):
    name: str
    distance: int

    start_city_id: UUID
    end_city_id: UUID


class Route(RouteBase):
    team_claims: list[ClaimInfo] = []


class ClaimedRoute(RouteBase):
    claimed_by_user: UUID
    claim_time: datetime
