import uuid

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import as_declarative


@as_declarative()
class Base:
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    def __repr__(self) -> str:
        public_attr = {key: value for key, value in self.__dict__.items() if not key.startswith("_")}
        return f"{self.__class__.__name__}({public_attr!r})"
