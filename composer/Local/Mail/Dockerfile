FROM debian:latest
RUN apt update && apt install spf-tools-perl exim4-daemon-heavy dovecot-common dovecot-imapd dovecot-managesieved dovecot-pgsql dovecot-pop3d dovecot-sieve gettext-base -y && apt clean
COPY exim.conf /etc/exim4/
COPY dovecot.conf /etc/dovecot/
COPY dovecot_passwd /etc/dovecot/passwd
COPY start.sh .
RUN mkdir /mail && chown mail:mail /mail && chmod 777 /mail && mkdir /var/run/dovecot && chown dovecot:dovecot /var/run/dovecot
EXPOSE 25 143
ENTRYPOINT ["./start.sh"]

