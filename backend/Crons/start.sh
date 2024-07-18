#!/bin/bash

/usr/sbin/sshd
gpg-agent --daemon
gpg --no-auto-key-retrieve --no-symkey-cache --no-default-keyring --keyring ./keyring.pgp --import  ./private.pgp
dotnet Crons.dll