FROM nginx:latest
COPY transbithub/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

COPY wwwroot/css /usr/share/nginx/html/css
COPY wwwroot/js /usr/share/nginx/html/js