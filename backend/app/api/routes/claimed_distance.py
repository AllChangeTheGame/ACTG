from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.routes import get_route_from_db
from app.api.routes.sites import get_site_from_db
from app.db.session import yield_db

router = APIRouter()


def calculate_team_claimed_distance(team: schemas.Team, db: Session) -> schemas.ClaimedDistance:
    route_claims = (
        db.query(models.RouteClaim).filter(models.RouteClaim.team_id == team.id, models.RouteClaim.is_active).all()
    )
    route_distance = [get_route_from_db(route_claim.route_id, db).distance for route_claim in route_claims]

    bonus_site_claims = (
        db.query(models.BonusSiteClaim)
        .filter(models.BonusSiteClaim.team_id == team.id, models.BonusSiteClaim.is_active)
        .all()
    )
    site_distance = [
        get_site_from_db(bonus_site_claim.site_id, db).site_value for bonus_site_claim in bonus_site_claims
    ]

    team_distance = sum(route_distance) + sum(site_distance)

    return team_distance


@router.get("/claimed-distance/", response_model=list[schemas.ClaimedDistance])
def get_claimed_distance(db: Session = Depends(yield_db)):
    teams = db.query(models.Team).all()

    claimed_distances = []

    for team in teams:
        team_distance = calculate_team_claimed_distance(team, db)

        claimed_distance = schemas.ClaimedDistance(
            team_id=team.id,
            team_name=team.name,
            claimed_distance=team_distance,
        )

        claimed_distances.append(claimed_distance)

    return claimed_distances


@router.get("/claimed-distance/{team_id}/", response_model=schemas.ClaimedDistance)
def get_team_claimed_distance(team_id: UUID, db: Session = Depends(yield_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    team_distance = calculate_team_claimed_distance(team, db)

    claimed_distance = schemas.ClaimedDistance(
        team_id=team.id,
        team_name=team.name,
        claimed_distance=team_distance,
    )

    return claimed_distance
