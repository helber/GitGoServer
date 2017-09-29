FROM golang:1.9
MAINTAINER Helber Maciel Guerra <helbermg@gmail.com>

COPY . /app/GitGoServer

RUN \
    cd /app/GitGoServer && \
    git submodule update --init

RUN \
    export GOPATH=/app/GitGoServer/Libraries && \
    cd /app/GitGoServer && \
    cp -r /app/GitGoServer/templates /go/templates && \
    cp -r /app/GitGoServer/static /go/static && \
    go build -o /app/app

# COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/app/app", "-dir", "/go/static", "-dirBackup", "/go/static"]
# ENTRYPOINT ["/entrypoint.sh"]
