import os
from mimetypes import guess_type

import uvicorn
from fastapi import FastAPI, UploadFile, Form, HTTPException, Depends
from starlette import status
from starlette.responses import Response

from song_repository.base_song_repository import BaseSongRepository, TrackNotFound
from song_repository.models.song.internal import TrackType
from song_repository.models.song.metadata import SongMetadata
from song_repository.models.song.requests import SearchSongRequest, RandomSongRequest
from song_repository.song_repository import SongRepository

app = FastAPI()

__song_repository: BaseSongRepository | None = None


def get_song_repository() -> BaseSongRepository:
    global __song_repository
    if __song_repository is None:
        __song_repository = SongRepository()
    return __song_repository


@app.post("/upload")
async def upload(
    file: UploadFile,
    title: str = Form(),
    artist: str | None = Form(),
    year: int | None = Form(),
    image_url: str | None = Form(),
    song_repository: BaseSongRepository = Depends(get_song_repository),
) -> str:
    _, codec = os.path.splitext(file.filename)
    song_data = await file.read()

    return await song_repository.upload(
        metadata=SongMetadata(title=title, artist=artist, year=year, image_url=image_url),
        song_data=song_data,
        codec=codec,
    )


@app.get("/search")
async def search(
    request: SearchSongRequest = Depends(), song_repository: BaseSongRepository = Depends(get_song_repository)
) -> list[tuple[str, SongMetadata]]:
    return await song_repository.search(request)


@app.get("/random")
async def random(
    request: RandomSongRequest = Depends(), song_repository: BaseSongRepository = Depends(get_song_repository)
) -> tuple[str, SongMetadata]:
    try:
        return await song_repository.random(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/song/{song_id}/{track_type}")
async def get_track(
    song_id: str, track_type: TrackType, song_repository: BaseSongRepository = Depends(get_song_repository)
) -> Response:
    try:
        data, codec = await song_repository.get_track(song_id, track_type)
    except TrackNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found")
    media_type, _ = guess_type("song" + codec)
    return Response(
        data,
        media_type=media_type,
        headers={"Content-Range": f"bytes 0-{len(data) - 1}/{len(data)}", "Accept-Ranges": "bytes"},
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
