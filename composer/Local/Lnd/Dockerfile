FROM lightninglabs/lnd:v0.12.0-beta
RUN echo "151.101.126.133	dl-cdn.alpinelinux.org" >> /etc/hosts
RUN apk update && apk add tini socat
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT ["tini", "--"]
#https://github.com/lightningnetwork/lnd/blob/master/sample-lnd.conf
CMD /start.sh