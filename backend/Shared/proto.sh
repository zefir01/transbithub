FRONT="$HOME/WebstormProjects/front"
ADMINKA="$HOME/WebstormProjects/adminka"

protoc -I Protos -I /usr/include/google/protobuf --plugin protoc-gen-grpc=/usr/local/bin/protoc-gen-grpc-web --js_out=import_style=commonjs:$FRONT/src/Protos --grpc-web_out=import_style=typescript,mode=grpcwebtext:$FRONT/src/Protos Protos/profile.proto
protoc -I Protos -I /usr/include/google/protobuf --plugin protoc-gen-grpc=/usr/local/bin/protoc-gen-grpc-web --js_out=import_style=commonjs:$FRONT/src/Protos --grpc-web_out=import_style=typescript,mode=grpcwebtext:$FRONT/src/Protos Protos/api.proto

protoc -I . -I /usr/include/google/protobuf --plugin protoc-gen-grpc=/usr/local/bin/protoc-gen-grpc-web --js_out=import_style=commonjs:$ADMINKA/src --grpc-web_out=import_style=typescript,mode=grpcwebtext:$ADMINKA/src Protos/adminka.proto
protoc -I . -I /usr/include/google/protobuf --plugin protoc-gen-grpc=/usr/local/bin/protoc-gen-grpc-web --js_out=import_style=commonjs:$ADMINKA/src --grpc-web_out=import_style=typescript,mode=grpcwebtext:$ADMINKA/src Protos/api.proto

for f in $FRONT/src/Protos/*.js
do
    echo '/* eslint-disable */' | cat - "${f}" > temp && mv temp "${f}"
done

for f in $ADMINKA/src/Protos/*.js
do
     echo '/* eslint-disable */' | cat - "${f}" > temp && mv temp "${f}"
done

