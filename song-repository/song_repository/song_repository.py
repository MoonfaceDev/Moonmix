import io

from bson import ObjectId
from faststream.rabbit import RabbitBroker
from minio import Minio
from pymongo import MongoClient

from song_repository.base_song_repository import BaseSongRepository, TrackNotFound
from song_repository.models.song.audio_object_reference import AudioObjectReference
from song_repository.models.song.internal import InternalSong, TrackType
from song_repository.models.song.metadata import SongMetadata
from song_repository.models.song.requests import SearchSongRequest, RandomSongRequest, SongQuery
from song_repository.models.tasks.split import SplitTask


class SongRepository(BaseSongRepository):
    _BUCKET_NAME = "audio"
    _DB_NAME = "moonmix"
    _SONGS_COLLECTION = "songs"

    def __init__(self):
        self._db = MongoClient("mongo")[SongRepository._DB_NAME]
        self._minio = Minio("minio:9000", secure=False, access_key="root", secret_key="password")
        if not self._minio.bucket_exists(SongRepository._BUCKET_NAME):
            self._minio.make_bucket(SongRepository._BUCKET_NAME)

    async def upload(self, metadata: SongMetadata, song_data: bytes, codec: str) -> str:
        song_object = AudioObjectReference(codec=codec)
        self._put_audio_object(song_object.name, song_data)
        song = InternalSong(metadata=metadata, tracks={TrackType.All: song_object})
        insert_result = self._db[SongRepository._SONGS_COLLECTION].insert_one(song.dict())
        song_id = str(insert_result.inserted_id)
        await self._send_split_task(song_id)
        return song_id

    def _put_audio_object(self, object_name: str, audio: bytes):
        self._minio.put_object(SongRepository._BUCKET_NAME, object_name, io.BytesIO(audio), len(audio))

    @classmethod
    async def _send_split_task(cls, song_id: str):
        task = SplitTask(song_id=song_id)
        async with RabbitBroker("amqp://guest:guest@rabbitmq:5672/") as broker:
            await broker.publish(task, queue="track-splitter")

    async def search(self, request: SearchSongRequest) -> list[tuple[str, SongMetadata]]:
        filter_ = self._get_mongo_filter(request)
        cursor = (
            self._db[SongRepository._SONGS_COLLECTION]
            .find(filter_)
            .skip(request.page_index * request.page_size)
            .limit(request.page_size)
        )

        return [(str(document["_id"]), InternalSong.model_validate(document).metadata) for document in cursor]

    async def random(self, request: RandomSongRequest) -> tuple[str, SongMetadata]:
        filter_ = self._get_mongo_filter(request)
        cursor = self._db[SongRepository._SONGS_COLLECTION].aggregate([{"$match": filter_}, {"$sample": {"size": 1}}])
        document = next(cursor)

        return str(document["_id"]), InternalSong.model_validate(document).metadata

    @classmethod
    def _get_mongo_filter(cls, query: SongQuery) -> dict:
        title_filter = (
            {
                "$or": [
                    {"metadata.title": {"$regex": query.free_text, "$options": "i"}},
                    {"metadata.artist": {"$regex": query.free_text, "$options": "i"}},
                ]
            }
            if query.free_text
            else {}
        )
        return title_filter

    def _get_audio_object(self, object_name: str) -> bytes:
        response = self._minio.get_object(SongRepository._BUCKET_NAME, object_name)
        try:
            return response.data
        finally:
            response.close()
            response.release_conn()

    async def get_track(self, song_id: str, track_type: TrackType) -> tuple[bytes, str]:
        document = self._db[SongRepository._SONGS_COLLECTION].find_one({"_id": ObjectId(song_id)})
        if document is None:
            raise TrackNotFound

        song = InternalSong.model_validate(document)

        try:
            object_reference = song.tracks[track_type]
        except KeyError:
            raise TrackNotFound

        return self._get_audio_object(object_reference.name), object_reference.codec
