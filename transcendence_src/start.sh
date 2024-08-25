#!/bin/bash

python ./manage.py migrate
gunicorn --certfile=certs/cert.pem --keyfile=certs/key.pem --bind 0.0.0.0:8000 transcendence.wsgi:application