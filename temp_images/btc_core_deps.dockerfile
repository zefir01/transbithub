FROM debian:stable-slim
RUN apt update && apt install -y libboost-system1.67.0 libboost-filesystem1.67.0 libboost-test1.67.0 \
 libboost-thread1.67.0 libevent-2.1-6 libdb5.3++ libevent-pthreads-2.1-6 libzmq5 tini && apt-get clean all
WORKDIR /opt

