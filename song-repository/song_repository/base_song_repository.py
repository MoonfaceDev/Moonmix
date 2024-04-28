from abc import ABC, abstractmethod

from song_repository.models.song.internal import TrackType
from song_repository.models.song.metadata import SongMetadata
from song_repository.models.song.requests import SearchSongRequest, RandomSongRequest


class TrackNotFound(Exception):
    pass


class BaseSongRepository(ABC):
    @abstractmethod
    async def upload(self, metadata: SongMetadata, song_data: bytes, codec: str) -> str:
        pass

    @abstractmethod
    async def search(self, request: SearchSongRequest) -> list[tuple[str, SongMetadata]]:
        pass

    @abstractmethod
    async def random(self, request: RandomSongRequest) -> tuple[str, SongMetadata]:
        pass

    @abstractmethod
    async def get_track(self, song_id: str, track_type: TrackType) -> tuple[bytes, str]:
        pass
