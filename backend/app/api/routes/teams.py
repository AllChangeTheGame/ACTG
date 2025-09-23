import functools
from typing import Annotated, Union
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db
from app.utils import get_user_id_from_authorization

router = APIRouter()


@functools.cache
def get_team_from_db(team_id: UUID, db: Session):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    return team


@functools.cache
def get_user_from_db(user_id: UUID, db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def parse_claims(claims: Union[models.BonusSiteClaim, models.RouteClaim], attr_name: str):
    claimed_sites = [getattr(claim, attr_name) for claim in claims]
    return claimed_sites


@router.get("/teams/", response_model=list[schemas.Team])
def list_teams(db: Session = Depends(yield_db)):
    teams = db.query(models.Team).all()

    response_teams = []
    for team in teams:
        response_teams.append(
            schemas.Team(
                id=team.id,
                name=team.name,
                claimed_routes=parse_claims(team.claimed_routes, "route_id"),
                claimed_bonus_sites=parse_claims(team.claimed_bonus_sites, "site_id"),
                wallet_euros=team.wallet_euros,
            )
        )
    return response_teams


@router.get("/users/", response_model=list[schemas.User])
def list_users(db: Session = Depends(yield_db)):
    users = db.query(models.User).all()
    print(users)
    return users


@router.get("/users/me/", response_model=schemas.User)
def get_current_user(authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    return user


@router.get("/teams/{team_id}/", response_model=schemas.Team)
def get_team(team_id: UUID, db: Session = Depends(yield_db)):
    return get_team_from_db(team_id, db)


@router.get("/teams/{team_id}/routes/", response_model=list[schemas.ClaimedRoute])
def get_team_routes(team_id: UUID, db: Session = Depends(yield_db)):
    team = get_team_from_db(team_id, db)

    claimed_routes = (
        db.query(models.Route)
        .filter(
            models.Route.id == models.RouteClaim.route_id,
            models.RouteClaim.team_id == team.id,
            models.RouteClaim.is_active,
        )
        .all()
    )

    claimed_routes_response = []
    for route in claimed_routes:
        [relevant_team_claim] = [claim for claim in route.claimed_by_teams if claim.team_id == team.id]
        claimed_routes_response.append(
            schemas.ClaimedRoute(
                id=route.id,
                name=route.name,
                distance=route.distance,
                start_city_id=route.start_city_id,
                end_city_id=route.end_city_id,
                claimed_by_user=relevant_team_claim.last_updated_user_id,
                claim_time=relevant_team_claim.last_updated_time,
            )
        )

    claimed_routes_response.sort(key=lambda claim: claim.claim_time)
    return claimed_routes_response


@router.get("/teams/{team_id}/bonus-sites/", response_model=list[schemas.ClaimedBonusSite])
def get_team_sites(team_id: UUID, db: Session = Depends(yield_db)):
    team = get_team_from_db(team_id, db)
    claimed_bonus_sites = (
        db.query(models.BonusSite)
        .filter(
            models.BonusSite.id == models.BonusSiteClaim.site_id,
            models.BonusSiteClaim.team_id == team.id,
            models.BonusSiteClaim.is_active,
        )
        .all()
    )

    claimed_bonus_sites_response = []
    for site in claimed_bonus_sites:
        [relevant_team_claim] = [claim for claim in site.claimed_by_teams if claim.team_id == team.id]
        claimed_bonus_sites_response.append(
            schemas.ClaimedBonusSite(
                id=site.id,
                site_name=site.site_name,
                city=site.city,
                country=site.country,
                latitude=site.latitude,
                longitude=site.longitude,
                site_value=site.site_value,
                claimed_by_user=relevant_team_claim.last_updated_user_id,
                claim_time=relevant_team_claim.last_updated_time,
            )
        )

    claimed_bonus_sites_response.sort(key=lambda claim: claim.claim_time)
    return claimed_bonus_sites_response


@router.get("/teams/{team_id}/users/", response_model=list[schemas.User])
def get_team_users(team_id: UUID, db: Session = Depends(yield_db)):
    team = get_team_from_db(team_id, db)
    return team.users
