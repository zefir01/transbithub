#!/bin/bash
apt update
apt install net-tools
addr=`ifconfig eth0 | grep 'inet ' | awk '{ print $2}'`
/opt/bitcoind -rpcbind=$addr -rpcallowip=172.18.0.0/16 -rpcport=18334 -datadir=/opt/data -fallbackfee=0.0002 -txconfirmtarget=3 -zmqpubhashblock=tcp://0.0.0.0:28332 -zmqpubhashtx=tcp://0.0.0.0:28332 -zmqpubrawblock=tcp://0.0.0.0:28332 -zmqpubrawtx=tcp://0.0.0.0:28332
