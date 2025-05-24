from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ModelBase(BaseModel):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
