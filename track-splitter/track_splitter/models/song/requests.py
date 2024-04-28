from __future__ import annotations

import re
from typing import Annotated, Optional

from pydantic import BaseModel, Field

from track_splitter.models.song.metadata import SongGenre


class SongQuery(BaseModel):
    free_text: Optional[Annotated[str, Field(pattern=re.compile(r"^[\w\s]+$"))]] = None
    genre: Optional[SongGenre] = None


class SearchSongRequest(SongQuery):
    page_index: int = 0
    page_size: int = 10


class RandomSongRequest(SongQuery):
    pass
