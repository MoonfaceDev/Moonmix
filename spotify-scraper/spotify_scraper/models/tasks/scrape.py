from pydantic import BaseModel

from spotify_scraper.models.song.metadata import SongMetadata


class ScrapeTask(BaseModel):
    url: str
    song_metadata: SongMetadata
