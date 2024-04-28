FROM python:3.12

RUN pip install poetry==1.8.2
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN poetry install --only main

ENV PATH="/app/.venv/bin:$PATH"

COPY song_repository /app/song_repository
CMD ["gunicorn", "song_repository.app:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:80"]
