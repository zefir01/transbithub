FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /opt
RUN apt-get update && apt-get install -y gpg-agent tini && apt-get clean all
ARG ENVIRONMENT
COPY bin/${ENVIRONMENT}/ .
COPY start.sh .
EXPOSE 50080
ENTRYPOINT ["tini", "--"]
CMD ["/opt/start.sh"]


