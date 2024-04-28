from enum import Enum
from typing import Optional

from pydantic import BaseModel


class SongGenre(str, Enum):
    Rock = "Rock"
    IsraeliRock = "Israeli Rock"
    Pop = "Pop"
    Rap = "Rap"


class SongMetadata(BaseModel):
    title: str
    artist: str
    year: int
    genre: SongGenre
    image_url: Optional[str] = None
