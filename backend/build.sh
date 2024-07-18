#!/bin/bash

set -e

cd ~/front
git fetch
if [[ ! -z "$1" ]]; then
  git checkout "$1"
fi
COUNT=$(git rev-list HEAD...origin/master --count)
if [[ $COUNT > 0 ]]; then
  git pull
  npm install
  npm run build-transbithub
  npm run build-transbithub-test
  cd ~/back
  docker-compose -f Composer/Prod/docker-compose-master.yml build front
  docker-compose -f Composer/Prod/docker-compose-front.yml build front
  docker-compose -f Composer/Test/docker-compose-front.yml build front
fi

cd ~/docs_static
git fetch
if [[ ! -z "$1" ]]; then
  git checkout "$1"
fi
COUNT=$(git rev-list HEAD...origin/master --count)
if [[ $COUNT > 0 ]]; then
  cd ru
  git pull
  npm install
  mkdocs build
  cd ~/back
  docker-compose -f Composer/Prod/docker-compose-master.yml build docs-static
  docker-compose -f Composer/Prod/docker-compose-front.yml build docs-static
  docker-compose -f Composer/Test/docker-compose-front.yml build docs-static
fi

cd ~/adminka
git fetch
if [[ ! -z "$1" ]]; then
  git checkout "$1"
fi
COUNT=$(git rev-list HEAD...origin/master --count)
if [[ $COUNT > 0 ]]; then
  git pull
  npm ci
  npm run build:prod
  cd ~/back
  docker-compose -f Composer/Prod/docker-compose-master.yml build adminka-front
  cd ~/adminka
  npm run build:test
  cd ~/back
  docker-compose -f Composer/Test/docker-compose-master.yml build adminka-front

fi

cd ~/back
git fetch --recurse-submodules=yes
if [[ ! -z "$1" ]]; then
  git checkout "$1"
fi
COUNT=$(git rev-list HEAD...origin/master --count)
if [[ $COUNT > 0 ]]; then
  git pull
  git submodule update --init --recursive
  dotnet build -c Release
  docker-compose -f Composer/Prod/docker-compose-master.yml build envoy nats auth backend bitcoind-exporter btc-core docker-exporter fluentd grafana jira-sd mail node_exporter postgres-data postgres-exporter-data postgres-exporter-identity postgres-exporter-jira postgres-exporter-telegram postgres-identity postgres-telegram prometheus crons btc-service crons telegram-service lnd adminka cli postgres-telegram-notify telegram-notify-service
  dotnet build -c Debug
  docker-compose -f Composer/Test/docker-compose-master.yml build envoy nats auth backend btc-core jira-sd mail postgres-data postgres-identity postgres-jira postgres-telegram crons btc-service crons telegram-service lnd adminka cli postgres-telegram-notify telegram-notify-service
fi

docker-compose -f Composer/Prod/docker-compose-master.yml push
docker-compose -f Composer/Test/docker-compose-master.yml push
docker-compose -f Composer/Prod/docker-compose-front.yml push
docker-compose -f Composer/Test/docker-compose-front.yml push
