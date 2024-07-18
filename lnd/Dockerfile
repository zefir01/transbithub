FROM lightninglabs/lnd:v0.12.0-beta
#RUN echo "151.101.126.133	dl-cdn.alpinelinux.org" >> /etc/hosts
RUN apk update && apk add tini
COPY start.sh /start.sh
ENTRYPOINT ["tini", "--"]
CMD /start.sh
