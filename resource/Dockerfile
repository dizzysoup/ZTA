FROM python:3.10
LABEL maintainer="orcahmlee@gmail.com"


COPY ./resource/docker-entrypoint.sh /usr/local/bin/
RUN pip install --upgrade pip
WORKDIR /web
COPY ./resource/requirements.txt ./
RUN pip install -r ./requirements.txt
COPY . .



CMD python manage.py runserver 0.0.0.0:8002