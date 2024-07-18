FROM python:3
VOLUME ["/root/.teos"]
WORKDIR /srv
RUN apt-get update && apt-get -y install libffi-dev libssl-dev pkg-config libleveldb-dev
RUN git clone https://github.com/talaia-labs/python-teos.git && cd python-teos && git checkout v0.1.1 && pip3 install .
WORKDIR /srv/python-teos 
EXPOSE 9814/tcp
ENTRYPOINT [ "/srv/python-teos/docker/entrypoint.sh" ]