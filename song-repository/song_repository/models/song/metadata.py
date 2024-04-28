from enum import StrEnum

from pydantic import BaseModel


class SongGenre(StrEnum):
    Rock = "Rock"
    IsraeliRock = "Israeli Rock"
    Pop = "Pop"
    Rap = "Rap"


class SongMetadata(BaseModel):
    title: str
    artist: str
    year: int
    genre: SongGenre
    image_url: str | None = None
