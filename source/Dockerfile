FROM python:3.10
LABEL maintainer="orcahmlee@gmail.com"


COPY ./source/docker-entrypoint.sh /usr/local/bin/

WORKDIR /web
COPY . /web/
RUN pip install --upgrade pip
RUN pip install -r ./source/requirements.txt

CMD python manage.py runserver 0.0.0.0:8002