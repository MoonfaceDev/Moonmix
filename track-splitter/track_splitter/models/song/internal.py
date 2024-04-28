from enum import Enum
from typing import Dict

from pydantic import BaseModel

from track_splitter.models.song.audio_object_reference import AudioObjectReference
from track_splitter.models.song.metadata import SongMetadata


class TrackType(str, Enum):
    All = "all"
    Bass = "bass"
    Drums = "drums"
    Other = "other"
    Piano = "piano"
    Vocals = "vocals"


class InternalSong(BaseModel):
    metadata: SongMetadata
    tracks: Dict[TrackType, AudioObjectReference] = {}
