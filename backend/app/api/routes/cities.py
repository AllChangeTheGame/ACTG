from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db

router = APIRouter()


@router.get("/cities/", response_model=list[schemas.City])
def list_cities(db: Session = Depends(yield_db)):
    cities = db.query(models.City).all()
    return cities


@router.get("/cities/{city_id}", response_model=schemas.City)
def get_city(city_id: UUID, db: Session = Depends(yield_db)):
    city = db.query(models.City).filter(models.City.id == city_id).first()
    return city
