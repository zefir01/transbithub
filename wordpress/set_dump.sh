#!/bin/bash

set -e

cat dump | sed "s|___URL___|https://test.transbithub.com|g" > dump_test

CONTAINER=$(docker --context front-test ps --format "{{.Names}}" | grep mariadb)
docker --context front-test cp dump_test $CONTAINER:/
docker --context front-test exec $CONTAINER bash -c "MYSQL_PWD=wordpress mysql -u wordpress  wordpress < /dump_test"
rm dump_test

