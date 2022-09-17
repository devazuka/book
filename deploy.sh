mkdir -p .go
GOMODCACHE="$PWD.go" go build
./book migrate up
