import json
import os
import tempfile

from bson.objectid import ObjectId
from faststream import FastStream, Context, ContextRepo
from faststream.rabbit import RabbitBroker
from minio import Minio
from pymongo import MongoClient
from pymongo.database import Database
from spleeter.audio import Codec
from spleeter.separator import Separator

from track_splitter.models.song.audio_object_reference import AudioObjectReference
from track_splitter.models.song.internal import InternalSong, TrackType
from track_splitter.models.tasks.split import SplitTask

_BUCKET_NAME = "audio"
_DB_NAME = "moonmix"
_SONGS_COLLECTION = "songs"

broker = RabbitBroker("amqp://guest:guest@rabbitmq:5672/")
app = FastStream(broker)


@app.on_startup
async def setup_model(context: ContextRepo):
    context.set_global("db", MongoClient("mongo")[_DB_NAME])
    context.set_global("minio", Minio("minio:9000", secure=False, access_key="root", secret_key="password"))
    context.set_global("separator", Separator("spleeter:5stems"))


def _get_song(db: Database, song_id: str) -> InternalSong:
    song_document = db[_SONGS_COLLECTION].find_one({"_id": ObjectId(song_id)})
    return InternalSong.parse_obj(song_document)


def _download_audio_object(minio: Minio, object_name: str, file_name: str) -> None:
    minio.fget_object(_BUCKET_NAME, object_name, file_name)


def _upload_audio_file(minio: Minio, object_name: str, path: str) -> None:
    minio.fput_object(_BUCKET_NAME, object_name, path)


@broker.subscriber("track-splitter")
async def split_track(
    task: SplitTask, db: Database = Context(), minio: Minio = Context(), separator: Separator = Context()
) -> None:
    print(f"Received a new task: {task.json()}")

    song = _get_song(db, task.song_id)
    all_track = song.tracks[TrackType.All]

    with tempfile.NamedTemporaryFile(suffix=all_track.codec) as file:
        _download_audio_object(minio, all_track.name, file.name)
        file.seek(0)

        with tempfile.TemporaryDirectory() as dir_name:
            separator.separate_to_file(file.name, dir_name, codec=Codec.MP3)
            tmp_input_name, _ = os.path.splitext(os.path.basename(file.name))
            output_dir = os.path.join(dir_name, tmp_input_name)

            for output_file in os.listdir(output_dir):
                track_name, track_codec = os.path.splitext(output_file)
                track_object = AudioObjectReference(codec=track_codec)
                _upload_audio_file(minio, track_object.name, os.path.join(output_dir, output_file))
                song.tracks[TrackType(track_name)] = track_object

            db[_SONGS_COLLECTION].update_one({"_id": ObjectId(task.song_id)}, {"$set": json.loads(song.json())})

    print("Finished task")
