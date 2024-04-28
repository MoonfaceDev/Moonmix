from enum import StrEnum

from pydantic import BaseModel

from song_repository.models.song.audio_object_reference import AudioObjectReference
from song_repository.models.song.metadata import SongMetadata


class TrackType(StrEnum):
    All = "all"
    Bass = "bass"
    Drums = "drums"
    Other = "other"
    Piano = "piano"
    Vocals = "vocals"


class InternalSong(BaseModel):
    metadata: SongMetadata
    tracks: dict[TrackType, AudioObjectReference] = {}
