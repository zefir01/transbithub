#!/bin/bash

docker cp composer_lnd_1:/root/.lnd/admin.macaroon .
docker cp composer_lnd_1:/root/.lnd/tls.cert lnd.cert

docker cp composer_lnd_1:/root/.lnd/admin.macaroon ../Crons/
docker cp composer_lnd_1:/root/.lnd/tls.cert ../Crons/lnd.cert