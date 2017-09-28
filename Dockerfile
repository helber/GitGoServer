FROM golang:1.9
MAINTAINER Helber Maciel Guerra <helbermg@gmail.com>

COPY . /app/GitGoServer

RUN \
    cd /app/GitGoServer && \
    git submodule update --init

RUN \
    export GOPATH=/app/GitGoServer/Libraries && \
    cd /app/GitGoServer && \
    cp -r /app/GitGoServer/static /app/static && \
    go build -o /app/app && \
    rm -Rf /app/GitGoServer

ENV \
    MONGODB_HOST="mongo" \
    MONGODB_PASS="" \
    LISTEN_PORT="80"


ENTRYPOINT ["/app/app", "-dir", "/app/static", "-dirBackup", "/app/static"]
