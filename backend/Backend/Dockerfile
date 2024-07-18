FROM mcr.microsoft.com/dotnet/aspnet:5.0
RUN apt-get update && apt-get install -y openssh-server gpg-agent tini && apt-get clean all
RUN mkdir /var/run/sshd
RUN echo 'root:Batman01' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
RUN /usr/sbin/sshd
WORKDIR /opt
ARG ENVIRONMENT
COPY bin/${ENVIRONMENT}/ .
COPY start.sh .
EXPOSE 50050 50051 50052 22
ENTRYPOINT ["tini", "--"]
CMD ["/opt/start.sh"]


