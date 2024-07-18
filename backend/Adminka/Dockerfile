FROM mcr.microsoft.com/dotnet/aspnet:5.0
RUN apt-get update && apt-get install -y tini && apt-get clean all
WORKDIR /opt
ARG ENVIRONMENT
COPY bin/${ENVIRONMENT}/ .
EXPOSE 50053
ENTRYPOINT ["tini", "--"]
CMD ["dotnet", "Adminka.dll"]


