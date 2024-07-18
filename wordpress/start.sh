#!/bin/bash

chown -R www-data:www-data /var/www/html
docker-entrypoint.sh apache2-foreground

