FROM python:3.12

RUN apt-get -y update
RUN apt-get install -y ffmpeg

RUN pip install poetry==1.8.2
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN poetry install --only main

ENV PATH="/app/.venv/bin:$PATH"

COPY spotify_scraper /app/spotify_scraper
CMD ["faststream", "run", "spotify_scraper.app:app"]
