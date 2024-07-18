#!/bin/bash

set -m


tor_args="--tor.active \
--tor.socks=172.18.0.1:9050 \
--tor.streamisolation \
--tor.control=172.18.0.1:9051 \
--tor.targetipaddress=127.0.0.1 \
--tor.v3 \
--tor.privatekeypath=/root/.lnd/tor \
--tor.password=${TOR_PASSWORD}"

main_args="--alias=${ALIAS} \
--allow-circular-route \
--restlisten=\"0.0.0.0:10010\"  \
--rpclisten=\"0.0.0.0:10009\" \
--bitcoin.active \
--bitcoind.rpchost=${BTC_RPC_HOST} \
--bitcoind.rpcuser=${BTC_RPC_USER} \
--bitcoind.rpcpass=${BTC_RPC_PASS} \
--bitcoind.dir=/bitcoin \
--bitcoin.node=bitcoind \
--bitcoind.zmqpubrawblock=${BTC_ZMQ_RAW_BLOCKS} \
--bitcoind.zmqpubrawtx=${BTC_ZMQ_RAW_TX} \
--protocol.wumbo-channels \
--db.bolt.auto-compact \
--listen=0.0.0.0:${PORT} \
--externalip=${ALIAS} \
--debuglevel=debug \
--readonlymacaroonpath=/root/.lnd/readonly.macaroon \
--adminmacaroonpath=/root/.lnd/admin.macaroon \
--invoicemacaroonpath=/root/.lnd/invoice.macaroon \
--tlsextradomain=lnd \
--tlsautorefresh \
--minchansize=20000 \
--accept-keysend \
--maxpendingchannels=10 \
--protocol.anchors"

if [[ $TESTNET ]]
then
      main_args="${main_args} --bitcoin.testnet"
else
      main_args="${main_args} --bitcoin.mainnet"
fi

if [[ $TOR_ENABLE ]]
then
      eval lnd "${main_args}" "${tor_args}" &
else
      eval lnd "${main_args}" &
fi

while ! netstat -tna | grep 'LISTEN\>' | grep -q '10009\>'; do
  sleep 1 # time in seconds, tune it as needed
  if ! pgrep -x "lnd" > /dev/null
  then
    echo "LND crushed. exit 1."
    exit 1
  fi
done

if [[ $LND_PASSWORD ]]
then
      echo "LND started."
      echo "$LND_PASSWORD" | lncli unlock --stdin
      echo "Password sent."
fi

#socat "TCP4-listen:1009,fork,reuseaddr" "TCP4:127.0.0.1:10009" &
#socat "TCP4-listen:1010,fork,reuseaddr" "TCP4:127.0.0.1:10010" &

fg %1
#kill %2
#kill %3