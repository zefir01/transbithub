openssl req -newkey rsa:2048 -sha256 -nodes -keyout localhost.key -x509 -days 365 -out localhost.pem -subj "/C=US/ST=New York/L=Brooklyn/O=Example Brooklyn Company/CN=localhost"
