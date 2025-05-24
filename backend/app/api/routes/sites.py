from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.teams import get_user_from_db
from app.db.session import yield_db
from app.utils import get_user_id_from_authorization

router = APIRouter()


def get_site_from_db(site_id: UUID, db: Session):
    site = db.query(models.BonusSite).filter(models.BonusSite.id == site_id).first()
    if site is None:
        raise HTTPException(status_code=404, detail="Bonus Site not found")

    return site


@router.get("/bonus-sites/", response_model=list[schemas.BonusSite])
def list_bonus_sites(db: Session = Depends(yield_db)):
    bonus_sites = db.query(models.BonusSite).order_by(models.BonusSite.site_name).all()
    bonus_sites = [schemas.ClaimInfo.parse_claims(site) for site in bonus_sites]
    return bonus_sites


@router.get("/bonus-sites/claimed/", response_model=list[schemas.BonusSite])
def list_claimed_sites(db: Session = Depends(yield_db)):
    bonus_sites = (
        db.query(models.BonusSite)
        # Active claims only
        .filter(models.BonusSite.claimed_by_teams.any(), models.BonusSiteClaim.is_active)
        .order_by(models.BonusSite.site_name)
        .all()
    )
    bonus_sites = [schemas.ClaimInfo.parse_claims(site) for site in bonus_sites]
    return bonus_sites


@router.get("/bonus-sites/unclaimed/", response_model=list[schemas.BonusSite])
def list_unclaimed_sites(db: Session = Depends(yield_db)):
    bonus_sites = (
        db.query(models.BonusSite)
        .join(models.BonusSiteClaim, isouter=True)
        .filter(
            or_(
                # No claims
                ~models.BonusSite.claimed_by_teams.any(),
                # No active claims
                and_(models.BonusSite.claimed_by_teams.any(), ~models.BonusSiteClaim.is_active),
            )
        )
        .order_by(models.BonusSite.site_name)
        .all()
    )
    bonus_sites = [schemas.ClaimInfo.parse_claims(site) for site in bonus_sites]
    return bonus_sites


@router.get("/bonus-sites/{site_id}", response_model=schemas.BonusSite)
def get_bonus_site(site_id: UUID, db: Session = Depends(yield_db)):
    site = get_site_from_db(site_id, db)
    site = schemas.ClaimInfo.parse_claims(site)

    print(site)
    return site


@router.post("/bonus-sites/{site_id}/claim/")
def claim_bonus_site(site_id: UUID, authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)

    site = get_site_from_db(site_id, db)

    existing_claim = db.query(models.BonusSiteClaim).filter_by(site_id=site_id, team_id=user.team_id).first()

    if existing_claim and existing_claim.is_active:
        raise HTTPException(status_code=400, detail="Bonus site already claimed by the team")
    elif existing_claim and existing_claim.is_active is False:
        existing_claim.is_active = True
        existing_claim.last_updated_user_id = user.id
    else:
        new_claim = models.BonusSiteClaim(site_id=site.id, team_id=user.team_id, last_updated_user_id=user.id)
        db.add(new_claim)

    db.commit()
    return {"message": "Bonus site successfully claimed"}


@router.post("/bonus-sites/{site_id}/unclaim/")
def unclaim_bonus_site(site_id: UUID, authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)

    site = get_site_from_db(site_id, db)

    existing_claim = (
        db.query(models.BonusSiteClaim).filter_by(site_id=site.id, team_id=user.team_id, is_active=True).first()
    )
    if not existing_claim:
        raise HTTPException(status_code=400, detail="Route not claimed by that team")

    existing_claim.is_active = False
    existing_claim.last_updated_user_id = user.id
    db.commit()
    return {"message": "Bonus site successfully unclaimed"}
