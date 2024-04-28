from pydantic import BaseModel

from api_server.models.song.metadata import SongMetadata


class ScrapeTask(BaseModel):
    url: str
    song_metadata: SongMetadata
