#!/bin/sh

echo "Starting backend..."
echo $(hostname -I)

uwsgi --http :5000 --wsgi-file wsgi.py
#python3 main.py