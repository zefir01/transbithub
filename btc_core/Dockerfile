FROM __DEPS_TAG__
COPY build/* /usr/
RUN mkdir /opt/data

EXPOSE 18334 28332 8333

ENV BITCOIN_USER ${BITCOIN_USER}
ENV BITCOIN_PASS ${BITCOIN_PASS}
ENV BITCOIN_NETWORK_SHORT ${BITCOIN_NETWORK_SHORT}
ENV SITE_NAME_ONION ${SITE_NAME_ONION}
ENV BITCOIN_PORT ${BITCOIN_PORT}

ENTRYPOINT ["tini", "--"]
CMD bitcoind \
-rpcuser=${BITCOIN_USER} \
-rpcpassword=${BITCOIN_PASS} \
-server=1 \
-txconfirmtarget=3 \
-chain=${BITCOIN_NETWORK_SHORT} \
-proxy=172.18.0.1:9050 \
-listen=1 \
-externalip=${SITE_NAME_ONION} \
-rpcbind=0.0.0.0 \ 
-rpcallowip=10.0.0.0/8 \ 
-rpcport=${BITCOIN_PORT} \
-datadir=/opt/data \ 
-fallbackfee=0.0002 \
-txconfirmtarget=3 \
-zmqpubhashblock=tcp://0.0.0.0:28332 \
-zmqpubhashtx=tcp://0.0.0.0:28333 \
-zmqpubrawblock=tcp://0.0.0.0:28334 \
-zmqpubrawtx=tcp://0.0.0.0:28335 \
-dbcache=128 \
-rpcthreads=20 \
-walletdir=/opt/data
