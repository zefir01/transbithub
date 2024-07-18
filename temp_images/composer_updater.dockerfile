FROM docker
RUN echo -e "http://213.180.204.183/mirrors/alpine/latest-stable/main\nhttp://213.180.204.183/mirrors/alpine/latest-stable/community" > /etc/apk/repositories
RUN apk add --update --no-cache git sed curl docker-compose py3-pip
COPY deployer.py /bin/
RUN pip3 install pyyaml argparse
