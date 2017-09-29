# gOsmServer
gOsm-server


Installing:

clone this repository

git submodule update

export GOPATH="`pwd`/Libraries"

go build

./GitGoServer

# Using Docker and docker-compose

Follow instructions: https://docs.docker.com/compose/

## build
```bash
docker-compose build
```

## Starting:
```bash
docker-compose up
```

The default external port is 80, but you can change on docker-compose.yml

