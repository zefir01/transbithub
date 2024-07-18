#!/bin/bash

rm /var/run/dovecot/master.pid

envsubst < /etc/exim4/exim.conf > /tmp/exim
envsubst < /etc/dovecot/dovecot.conf > /tmp/dovecot
cp /tmp/exim /etc/exim4/exim.conf
cp /tmp/dovecot /etc/dovecot/dovecot.conf

dovecot -c /etc/dovecot/dovecot.conf -F &
exim -C /etc/exim4/exim.conf  -bd -v -d+all

