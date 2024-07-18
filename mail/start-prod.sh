#!/bin/bash

rm /var/run/dovecot/master.pid

dovecot -c /etc/dovecot/dovecot.conf -F &
exim -C /etc/exim4/exim.conf  -bd -v -d+all

