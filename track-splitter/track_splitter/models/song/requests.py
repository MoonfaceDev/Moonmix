from __future__ import annotations

import re
from typing import Annotated, Optional

from pydantic import BaseModel, Field


class SongQuery(BaseModel):
    free_text: Optional[Annotated[str, Field(pattern=re.compile(r"^[\w\s]+$"))]] = None


class SearchSongRequest(SongQuery):
    page_index: int = 0
    page_size: int = 10


class RandomSongRequest(SongQuery):
    pass
