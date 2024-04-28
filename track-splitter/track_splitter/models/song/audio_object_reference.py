import uuid

from pydantic import BaseModel, Field


class AudioObjectReference(BaseModel):
    codec: str
    name: str = Field(default_factory=lambda: str(uuid.uuid4()))
