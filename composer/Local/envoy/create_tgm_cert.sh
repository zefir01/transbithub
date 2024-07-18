openssl req -newkey rsa:2048 -sha256 -nodes -keyout telegram/private.key -x509 -days 365 -out telegram/public.pem -subj "/C=US/ST=New York/L=Brooklyn/O=Example Brooklyn Company/CN=85.175.177.240"
