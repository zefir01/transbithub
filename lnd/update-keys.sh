#!/bin/bash

sudo cp /var/lib/docker/volumes/composer_lnd/_data/admin.macaroon /home/user/RiderProjects/backend/Crons/admin.macaroon
sudo cp /var/lib/docker/volumes/composer_lnd/_data/admin.macaroon /home/user/RiderProjects/backend/Backend/admin.macaroon
sudo cp /var/lib/docker/volumes/composer_lnd/_data/tls.cert /home/user/RiderProjects/backend/Crons/lnd.cert
sudo cp /var/lib/docker/volumes/composer_lnd/_data/tls.cert /home/user/RiderProjects/backend/Backend/lnd.cert

