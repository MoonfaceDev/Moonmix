FROM tensorflow/tensorflow:2.13.0-gpu

RUN apt-get -y update
RUN apt-get install -y ffmpeg

RUN pip install poetry==1.8.2
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN poetry install --only main

ENV PATH="/app/.venv/bin:$PATH"

COPY track_splitter /app/track_splitter
CMD ["faststream", "run", "track_splitter.app:app"]
