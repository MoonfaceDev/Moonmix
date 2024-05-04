import json
import tempfile
from pathlib import Path
from typing import Any, IO

import httpx
import youtube_dl
from faststream import FastStream
from faststream.rabbit import RabbitBroker

from youtube_scraper.models.song.metadata import SongMetadata
from youtube_scraper.models.tasks.scrape import ScrapeTask

broker = RabbitBroker("amqp://guest:guest@rabbitmq:5672/")
app = FastStream(broker)


def _get_youtube_dl_options(out_dir: Path) -> dict[str, Any]:
    return {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': str(out_dir / '%(title)s.%(ext)s'),
    }


async def _upload(buffer: IO[bytes], song_metadata: SongMetadata) -> None:
    async with httpx.AsyncClient() as client:
        await client.post(
            url='http://song-repository/upload',
            data=json.loads(song_metadata.json()),
            files={'file': ('song.mp3', buffer, 'audio/mpeg')},
        )


@broker.subscriber("youtube-scraper")
async def _process_task(task: ScrapeTask):
    print(f'Received a new task: {task.json()}')

    with tempfile.TemporaryDirectory() as out_dir:
        out_dir = Path(out_dir)
        with youtube_dl.YoutubeDL(_get_youtube_dl_options(out_dir)) as ydl:
            info_dict = ydl.extract_info(task.url, download=True)

        song_metadata = SongMetadata(
            title=info_dict.get('track', info_dict['title']),
            artist=info_dict.get('artist'),
            year=info_dict.get('release_year'),
            image_url=info_dict['thumbnail'],
        )

        audio_file_path = next(out_dir.iterdir())
        with audio_file_path.open('rb') as audio_file:
            await _upload(audio_file, song_metadata)

    print('Finished task')
