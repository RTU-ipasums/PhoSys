FROM python:3.9-slim

RUN apt-get update && apt-get install -y apt-transport-https && \
    apt-get install -y libssl-dev libffi-dev gcc python3-dev musl-dev build-essential \
    libpq-dev netcat-openbsd

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

ENV CONDA_DIR /opt/conda
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py39_4.12.0-Linux-x86_64.sh -O ~/miniconda.sh && \
     /bin/bash ~/miniconda.sh -b -p /opt/conda

ENV PATH=$CONDA_DIR/bin:$PATH

COPY . /usr/src/app

RUN conda env update -n base --file env.yaml
RUN conda activate

RUN chmod +x /usr/src/app/entrypoint.sh