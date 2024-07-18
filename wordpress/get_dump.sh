#!/bin/bash

CONTAINER=$(docker --context front-test ps --format "{{.Names}}" | grep mariadb)
docker --context front-test exec -it $CONTAINER bash -c "MYSQL_PWD=wordpress mysqldump -u wordpress  wordpress" > dump
sed -i "s|https://test.transbithub.com|___URL___|g" dump

