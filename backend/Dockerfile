FROM python:3.10-bullseye

RUN apt-get update && apt-get install -y apt-transport-https && \
    apt-get install -y libssl-dev libffi-dev gcc python3-dev musl-dev build-essential gfortran \
    libpq-dev netcat-openbsd

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app
COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

RUN pip3 install uwsgi
#RUN rm -rf .[^.]* ..?*
COPY . .
COPY uwsgi.ini /etc/uwsgi/

RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "/usr/src/app/entrypoint.sh"]