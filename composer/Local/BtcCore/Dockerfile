FROM debian:stable-slim
WORKDIR /opt
COPY bitcoin-cli .
COPY bitcoind .
COPY btcCore.sh .
RUN mkdir /opt/data
COPY bitcoin.conf .
EXPOSE 18334 28332
#ENTRYPOINT ["./btcCore.sh"]
ENTRYPOINT ["/opt/bitcoind"]
CMD ["-rpcbind=0.0.0.0", \ 
"-rpcallowip=172.18.0.0/16", \ 
"-rpcport=18334", \
"-datadir=/opt/data", \ 
"-fallbackfee=0.0002", \
"-txconfirmtarget=3", \
"-zmqpubhashblock=tcp://0.0.0.0:28332", \
"-zmqpubhashtx=tcp://0.0.0.0:28333", \
"-zmqpubrawblock=tcp://0.0.0.0:28334", \
"-zmqpubrawtx=tcp://0.0.0.0:28335", "-testnet", "-conf=/opt/bitcoin.conf"]
