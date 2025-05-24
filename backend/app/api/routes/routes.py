from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import false

from app import models
from app.api import schemas
from app.api.routes.teams import get_user_from_db
from app.db.session import yield_db
from app.utils import get_user_id_from_authorization

router = APIRouter()


def get_route_from_db(route_id: UUID, db: Session):
    route = db.query(models.Route).filter(models.Route.id == route_id).first()
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    return route


@router.get("/routes/", response_model=list[schemas.Route])
def list_routes(db: Session = Depends(yield_db)):
    routes = db.query(models.Route).order_by(models.Route.name).all()
    routes = [schemas.ClaimInfo.parse_claims(route) for route in routes]
    return routes


@router.get("/routes/claimed/", response_model=list[schemas.Route])
def list_claimed_routes(db: Session = Depends(yield_db)):
    routes = (
        db.query(models.Route)
        # Active claims only
        .filter(models.Route.claimed_by_teams.any(), models.RouteClaim.is_active)
        .order_by(models.Route.name)
        .all()
    )
    routes = [schemas.ClaimInfo.parse_claims(route) for route in routes]
    return routes


@router.get("/routes/unclaimed/", response_model=list[schemas.Route])
def list_unclaimed_routes(db: Session = Depends(yield_db)):
    routes = (
        db.query(models.Route)
        .join(models.RouteClaim, isouter=True)
        .filter(
            or_(
                # No claims
                ~models.Route.claimed_by_teams.any(),
                # No active claims
                and_(models.Route.claimed_by_teams.any(), models.RouteClaim.is_active == false()),
            )
        )
        .order_by(models.Route.name)
        .all()
    )

    routes = [schemas.ClaimInfo.parse_claims(route) for route in routes]
    return routes


@router.get("/routes/{route_id}", response_model=schemas.Route)
def get_route(route_id: UUID, db: Session = Depends(yield_db)):
    route = get_route_from_db(route_id, db)
    route = schemas.ClaimInfo.parse_claims(route)
    return route


@router.post("/routes/{route_id}/claim/")
def claim_route(route_id: UUID, authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    route = get_route_from_db(route_id, db)

    existing_claims = db.query(models.RouteClaim).filter_by(route_id=route.id).all()

    active_claims = [claim for claim in existing_claims if claim.is_active]
    this_team_inactive_claim = [
        claim for claim in existing_claims if not claim.is_active and claim.team_id == user.team_id
    ]

    if len(active_claims) == 1:
        if active_claims[0].team_id != user.team_id:
            raise HTTPException(status_code=400, detail="Route already claimed by another team")
        elif active_claims[0].team_id == user.team_id:
            raise HTTPException(status_code=400, detail="Route already claimed by this team")
    elif len(active_claims) > 1:
        raise HTTPException(status_code=400, detail="Error: More than 1 team has claimed this route")
    elif len(this_team_inactive_claim) == 1:
        existing_claim = this_team_inactive_claim[0]
        existing_claim.is_active = True
        existing_claim.last_updated_user_id = user.id
    else:
        new_claim = models.RouteClaim(route_id=route.id, team_id=user.team_id, last_updated_user_id=user.id)
        db.add(new_claim)

    db.commit()
    return {"message": "Route successfully claimed"}


@router.post("/routes/{route_id}/unclaim/")
def unclaim_route(route_id: UUID, authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    route = get_route_from_db(route_id, db)

    existing_claim = (
        db.query(models.RouteClaim).filter_by(route_id=route.id, team_id=user.team_id, is_active=True).first()
    )
    if not existing_claim:
        raise HTTPException(status_code=400, detail="Route not claimed by that team")

    existing_claim.is_active = False
    existing_claim.last_updated_user_id = user.id
    db.commit()
    return {"message": "Route successfully unclaimed"}
