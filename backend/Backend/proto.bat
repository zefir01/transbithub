c:\Users\Coding\source\repos\protoc -I=c:\Users\Coding\Downloads\protobuf-3.9.1\src\ -I=Protos\ --csharp_out=Protos\ Protos\common.proto
c:\Users\Coding\source\repos\protoc -I=c:\Users\Coding\Downloads\protobuf-3.9.1\src\ -I=Protos\ --plugin=protoc-gen-grpc=c:\Users\Coding\.nuget\packages\grpc.tools\2.23.0\tools\windows_x64\grpc_csharp_plugin.exe --grpc_out=Protos\ --csharp_out=Protos\ Protos\profile.proto
c:\Users\Coding\source\repos\protoc -I=c:\Users\Coding\Downloads\protobuf-3.9.1\src\ -I=Protos\ --plugin=protoc-gen-grpc=c:\Users\Coding\.nuget\packages\grpc.tools\2.23.0\tools\windows_x64\grpc_csharp_plugin.exe --grpc_out=Protos\ --csharp_out=Protos\ Protos\api.proto

