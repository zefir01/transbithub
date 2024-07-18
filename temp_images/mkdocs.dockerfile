FROM python:3-buster
RUN apt update && apt install -y mkdocs && apt clean
RUN pip install mkdocs-material markdown-meta-extension mkdocs-minify-plugin mkdocs-redirects
