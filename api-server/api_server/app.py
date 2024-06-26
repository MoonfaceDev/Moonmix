import httpx
from fastapi import FastAPI, UploadFile, Form, Body, Depends, Response
from faststream.rabbit import RabbitBroker
from pydantic import TypeAdapter
from starlette.middleware.cors import CORSMiddleware

from api_server.models.song.metadata import SongMetadata
from api_server.models.song.requests import SearchSongRequest, RandomSongRequest
from api_server.models.song.track_type import TrackType
from api_server.models.tasks.scrape import ScrapeTask

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-youtube")
async def upload_youtube(url: str = Body(embed=True)):
    async with RabbitBroker("amqp://guest:guest@rabbitmq:5672/") as broker:
        await broker.publish(ScrapeTask(url=url), queue="youtube-scraper")


@app.post("/upload-spotify")
async def upload_spotify(url: str = Body(embed=True)):
    async with RabbitBroker("amqp://guest:guest@rabbitmq:5672/") as broker:
        await broker.publish(ScrapeTask(url=url), queue="spotify-scraper")


@app.get("/search")
async def search(request: SearchSongRequest = Depends()):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            url="http://song-repository/search", params=request.model_dump(mode="json", exclude_none=True)
        )
        return TypeAdapter(list[tuple[str, SongMetadata]]).validate_json(response.content)


@app.get("/random")
async def random(request: RandomSongRequest = Depends()):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            url="http://song-repository/random", params=request.model_dump(mode="json", exclude_none=True)
        )
        return TypeAdapter(tuple[str, SongMetadata]).validate_json(response.content)


@app.get("/song/{song_id}/{track_type}")
async def get_track(song_id: str, track_type: TrackType):
    async with httpx.AsyncClient() as client:
        response = await client.get(url=f"http://song-repository/song/{song_id}/{track_type.value}")
        return Response(content=response.content, status_code=response.status_code, headers=response.headers)
