from typing import Optional

from pydantic import BaseModel


class SongMetadata(BaseModel):
    title: str
    artist: Optional[str] = None
    year: Optional[int] = None
    image_url: Optional[str] = None
