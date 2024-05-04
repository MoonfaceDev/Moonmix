from pydantic import BaseModel


class ScrapeTask(BaseModel):
    url: str
