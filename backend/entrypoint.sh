#!/bin/bash

echo "Starting backend.."
echo $(hostname -I)

uwsgi uwsgi.ini
#uwsgi --http :5000 --wsgi-file wsgi.py
#python3 main.py