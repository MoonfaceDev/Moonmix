import asyncio
import contextlib
import json
import tempfile
from typing import IO, AsyncIterator

import httpx
import spotdl
from faststream import FastStream
from faststream.rabbit import RabbitBroker
from spotdl import SpotifyClient
from spotdl.utils.config import SPOTIFY_OPTIONS

from spotify_scraper.models.song.metadata import SongMetadata
from spotify_scraper.models.tasks.scrape import ScrapeTask


@contextlib.asynccontextmanager
async def lifespan() -> AsyncIterator[None]:
    SpotifyClient.init(**SPOTIFY_OPTIONS)
    yield


broker = RabbitBroker("amqp://guest:guest@rabbitmq:5672/")
app = FastStream(broker, lifespan=lifespan)


async def _upload(buffer: IO[bytes], song_metadata: SongMetadata) -> None:
    async with httpx.AsyncClient() as client:
        await client.post(
            url='http://song-repository/upload',
            data=json.loads(song_metadata.json()),
            files={'file': ('song.mp3', buffer, 'audio/mpeg')},
        )


@broker.subscriber("spotify-scraper")
async def _process_task(task: ScrapeTask):
    print(f'Received a new task: {task.json()}')

    with tempfile.TemporaryDirectory() as out_dir:
        downloader = spotdl.Downloader(
            settings={"output": f"{out_dir}/{{title}}.{{output-ext}}"},
            loop=asyncio.get_event_loop(),
        )

        song, path = await downloader.pool_download(spotdl.Song.from_url(task.url))

        song_metadata = SongMetadata(
            title=song.name,
            artist=song.artist,
            year=song.year,
            image_url=song.cover_url,
        )

        with path.open('rb') as audio_file:
            await _upload(audio_file, song_metadata)

        downloader.progress_handler.close()

    print('Finished task')
