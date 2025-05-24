from app.api.schemas.base import ModelBase


class City(ModelBase):
    location_name: str
    name: str
    country: str
    is_starter_city: bool
    latitude: float
    longitude: float
