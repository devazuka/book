#!/bin/bash

mkdir -p .go/mod
GOMODCACHE="$PWD.go/mod" GOCACHE="$PWD.go" go build
./book migrate up

cd app
npm install
PAGE=index npm run build
PAGE=admin npm run build
