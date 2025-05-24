import random
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.teams import get_user_from_db
from app.db.session import yield_db
from app.utils import get_user_id_from_authorization

router = APIRouter()


def get_all_screw_cards_from_db(db: Session, active_only: bool = True):
    screw_cards = db.query(models.ScrewCard).filter(models.ScrewCard.is_active == active_only).all()
    return screw_cards


def get_screw_card_from_db(screw_card_id: UUID, db: Session, active_only: bool = True):
    screw_card = (
        db.query(models.ScrewCard)
        .filter(models.ScrewCard.id == screw_card_id, models.ScrewCard.is_active == active_only)
        .first()
    )
    if screw_card is None:
        raise HTTPException(status_code=404, detail="Screw card not found")

    return screw_card


@router.get("/screw-cards/", response_model=list[schemas.ScrewCard])
def list_screw_cards(db: Session = Depends(yield_db)):
    screw_cards = get_all_screw_cards_from_db(db)
    return screw_cards


@router.get("/screw-cards/{screw_card_id}", response_model=schemas.ScrewCard)
def get_screw_card(screw_card_id: UUID, db: Session = Depends(yield_db)):
    screw_card = get_screw_card_from_db(screw_card_id, db)
    return screw_card


@router.post("/screw-cards/draw", response_model=schemas.ScrewCardDraw)
def draw_screw_cards(authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)

    screw_cards = get_all_screw_cards_from_db(db)

    drawn_card = random.choice(screw_cards)

    new_draw = models.ScrewCardDraw(
        screw_card_id=drawn_card.id,
        team_id=user.team_id,
        last_updated_user_id=user.id,
    )
    db.add(new_draw)
    db.commit()

    drawn_card.draw_time = new_draw.create_time
    drawn_card_response = schemas.ScrewCardDraw.model_validate(drawn_card)

    return drawn_card_response


@router.get("/screw-cards/draw-history/", response_model=list[schemas.ScrewCardDraw])
def get_drawn_screw_cards(authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    user = get_user_from_db(user_id, db)
    drawn_cards = db.query(models.ScrewCardDraw).filter_by(team_id=user.team_id).all()

    drawn_card_response = [
        schemas.ScrewCardDraw(
            id=drawn_card.id,
            title=drawn_card.screw_card.title,
            description=drawn_card.screw_card.description,
            draw_time=drawn_card.create_time,
        )
        for drawn_card in drawn_cards
    ]
    drawn_card_response.sort(key=lambda card: card.draw_time, reverse=True)
    return drawn_card_response
