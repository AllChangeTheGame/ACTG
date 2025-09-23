from decimal import Decimal
from uuid import UUID

from app.api.schemas.base import ModelBase


# Team
class Team(ModelBase):
    name: str
    claimed_routes: list[UUID]
    claimed_bonus_sites: list[UUID]
    wallet_euros: Decimal


# User
class User(ModelBase):
    # email: str
    given_name: str
    family_name: str
    firebase_uid: str
    team_id: UUID
