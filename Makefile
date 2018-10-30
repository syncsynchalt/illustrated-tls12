all: client server
	cd server && ./server &
	cd client && ./client

client:
	cd client && go build

server:
	cd server && go build

test:
	@for i in $$(find . -name '*_test.go' | xargs -n1 dirname | uniq); do \
		go test -timeout=5s $$i || exit 1; \
	done

clean:
	rm -f server/server client/client
	rm -f generate/generator

realclean: clean
	go clean -cache

vet:
	go vet --shadow ./...

fmt:
	go fmt ./...

.PHONY: client server all clean realclean test fmt vet

