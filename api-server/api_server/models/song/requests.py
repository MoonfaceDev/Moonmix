import re
from typing import Annotated

from pydantic import BaseModel, Field

from api_server.models.song.metadata import SongGenre


class SongQuery(BaseModel):
    free_text: Annotated[str, Field(pattern=re.compile(r"^[\w\s]+$"))] | None = None
    genre: SongGenre | None = None


class SearchSongRequest(SongQuery):
    page_index: int = 0
    page_size: int = 10


class RandomSongRequest(SongQuery):
    pass
