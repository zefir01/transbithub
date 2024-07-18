FROM envoyproxy/envoy:v1.14.1
EXPOSE 80 443 8080 9000 9443
ENTRYPOINT ["envoy", "-c", "/etc/envoy/envoy.yaml", "-l", "trace"]

