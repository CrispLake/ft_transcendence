#!/bin/bash

python ./manage.py migrate
gunicorn --certfile=certs/django.crt --keyfile=certs/django.key --bind 0.0.0.0:8000 transcendence.wsgi:application