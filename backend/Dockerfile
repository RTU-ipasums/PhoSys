FROM python:3.12.0a2-bullseye

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

#RUN conda create -y -n "phosys" python=3.10.8
RUN conda env create -f env.yml
RUN conda init bash
RUN exec bash && \
    conda activate phosys \
    conda env update -n phosys --file env.yaml

RUN chmod +x /usr/src/app/entrypoint.sh