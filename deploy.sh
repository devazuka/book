mkdir -p .go/mod
GOMODCACHE="$PWD.go/mod" GOCACHE="$PWD.go" go build
./book migrate up
