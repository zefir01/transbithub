FROM debian:stable-slim
WORKDIR /opt
RUN apt update && apt install -y git build-essential libtool \
 autotools-dev automake pkg-config bsdmainutils python3 libevent-dev \
 libboost-system-dev libboost-filesystem-dev libboost-test-dev libboost-thread-dev \
 libzmq3-dev libdb++-dev && apt-get clean all

