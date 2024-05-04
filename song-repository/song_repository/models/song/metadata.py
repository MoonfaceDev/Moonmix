from pydantic import BaseModel


class SongMetadata(BaseModel):
    title: str
    artist: str | None = None
    year: int | None = None
    image_url: str | None = None
