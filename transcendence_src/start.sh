#!/bin/bash

python ./manage.py migrate
gunicorn --certfile=certs/selfsigned.crt --keyfile=certs/selfsigned.key --bind 0.0.0.0:8000 transcendence.wsgi:application