from pydantic import BaseModel


class SplitTask(BaseModel):
    song_id: str
