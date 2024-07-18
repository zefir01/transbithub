#!/bin/bash

CONTAINER=$(docker --context front ps --format "{{.Names}}" | grep mariadb)
docker --context front exec -it $CONTAINER bash -c "MYSQL_PWD=wordpress mysqldump -u wordpress  wordpress" > dump
sed -i "s|https://transbithub.com|___URL___|g" dump

