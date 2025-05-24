import datetime
from typing import Union
from uuid import UUID

from pydantic import BaseModel

from app.models.teams import BonusSiteClaim, RouteClaim


class ClaimInfo(BaseModel):
    team_id: UUID
    user_id: UUID
    claim_time: datetime.datetime

    def get_claim_info(claim_object: Union[RouteClaim, BonusSiteClaim]) -> "ClaimInfo":
        return ClaimInfo(
            team_id=claim_object.team_id,
            user_id=claim_object.last_updated_user_id,
            claim_time=claim_object.last_updated_time,
        )

    def get_claim_info_list(claim_list: list[Union[RouteClaim, BonusSiteClaim]]) -> list["ClaimInfo"]:
        return [ClaimInfo.get_claim_info(claim) for claim in claim_list]

    @staticmethod
    def parse_claims(claimed_object):
        claimed_object.claimed_by_teams = [claim for claim in claimed_object.claimed_by_teams if claim.is_active]

        if claimed_object.claimed_by_teams:
            claimed_object.team_claims = ClaimInfo.get_claim_info_list(claimed_object.claimed_by_teams)

        delattr(claimed_object, "claimed_by_teams")
        return claimed_object
