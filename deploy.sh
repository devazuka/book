mkdir -p .go
GOMODCACHE=.go go build
./book migrate up
