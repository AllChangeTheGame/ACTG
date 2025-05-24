from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.teams import get_team_from_db, get_user_from_db
from app.db.session import yield_db
from app.utils import get_user_id_from_authorization

router = APIRouter()


@router.get("/user-locations/", response_model=list[schemas.UserLocation])
def get_user_locations(authorization: Annotated[str | None, Header()], db: Session = Depends(yield_db)):
    user_id = get_user_id_from_authorization(authorization)
    current_user = get_user_from_db(user_id, db)

    current_time = datetime.now(timezone.utc)
    valid_share_requests = (
        db.query(models.LocationShareRequest)
        .filter(
            models.LocationShareRequest.request_team_id == current_user.team_id,
            models.LocationShareRequest.request_start_time <= current_time,
            models.LocationShareRequest.request_end_time >= current_time,
        )
        .all()
    )

    valid_location_team_ids = [share_request.location_team_id for share_request in valid_share_requests]

    valid_location_team_ids.append(current_user.team_id)
    valid_location_user_ids = db.query(models.User).filter(models.User.team_id.in_(valid_location_team_ids)).all()

    locations = [
        db.query(models.UserLocation)
        .filter(
            models.UserLocation.user_id == tracking_user.id,
        )
        .order_by(models.UserLocation.logged_time.desc())
        .first()
        for tracking_user in valid_location_user_ids
    ]
    locations = [schemas.UserLocation.model_validate(location) for location in locations if location is not None]

    return locations


@router.post("/user-locations/request/")
def request_location_sharing(
    authorization: Annotated[str | None, Header()],
    location_share_request: schemas.LocationShareRequest,
    db: Session = Depends(yield_db),
):
    user_id = get_user_id_from_authorization(authorization)
    requesting_user = get_user_from_db(user_id, db)
    requested_team = get_team_from_db(location_share_request.request_team_id, db)

    if requesting_user.team_id == requested_team.id:
        return {"message": "You cannot request your own team's location"}

    current_time = datetime.now(timezone.utc)

    existing_request = (
        db.query(models.LocationShareRequest)
        .filter(
            models.LocationShareRequest.request_team_id == requesting_user.team_id,
            models.LocationShareRequest.location_team_id == requested_team.id,
            models.LocationShareRequest.request_start_time <= current_time,
            models.LocationShareRequest.request_end_time >= current_time,
        )
        .first()
    )

    if existing_request:
        return {"message": "Location sharing request already exists"}

    start_time = current_time - timedelta(minutes=5)
    end_time = current_time + timedelta(minutes=35)

    request = models.LocationShareRequest(
        user_id=requesting_user.id,
        request_team_id=requesting_user.team_id,
        location_team_id=requested_team.id,
        request_start_time=start_time,
        request_end_time=end_time,
    )
    db.add(request)
    db.commit()
    return {"message": "Location sharing request successfully created"}
