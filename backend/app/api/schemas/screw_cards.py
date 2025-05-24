import datetime

from app.api.schemas.base import ModelBase


class ScrewCard(ModelBase):
    title: str
    description: str


class ScrewCardDraw(ScrewCard):
    draw_time: datetime.datetime
