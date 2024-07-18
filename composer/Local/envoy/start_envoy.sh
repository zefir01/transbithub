#!/bin/bash

docker stop envoy-local
docker rm envoy-local
#docker run --restart=always --name envoy-local -d -v $(pwd)/envoy.local.yaml:/etc/envoy/envoy.yaml -v $(pwd)/telegram:/etc/envoy/telegram -p 80:80 -p 443:443 -p 9901:9901 envoyproxy/envoy:v1.14.1 -l debug -c /etc/envoy/envoy.yaml

docker run --restart=always --name envoy-local \
-d \
-v $(pwd)/envoy.local.yaml:/etc/envoy/envoy.yaml \
-v $(pwd)/telegram:/etc/envoy/telegram \
-v $(pwd)/fancrypto.key:/etc/envoy/site.key \
-v $(pwd)/fancrypto.pem:/etc/envoy/site.pem \
-p 80:80 \
-p 443:443 \
-p 8443:8443 \
-p 9901:9901 \
-p 8081:8081 \
envoyproxy/envoy:v1.14.1 

docker logs -f envoy-local

#docker run --network="host" -d --restart=always -v $(pwd)/envoy.yaml:/etc/envoy/envoy.yaml -p 8080:8080 -p 9901:9901 envoyproxy/envoy -l debug -c /etc/envoy/envoy.yaml
