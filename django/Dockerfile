FROM python:3-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./manage.py", "runserver", "0.0.0.0:8000" ]