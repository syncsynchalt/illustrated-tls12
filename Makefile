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

site:
	make -C generate

clean:
	rm -f server/server client/client
	rm -f generate/generator

realclean: clean
	go clean -cache

vet:
	go vet --shadow ./...

fmt:
	go fmt ./...

dist:
	@if [[ -z "${DISTROOT}" ]]; then echo "Must set \$$DISTROOT variable"; exit 1; fi
	rsync -rlpvhc site/ ${DISTROOT}/tls12/

.PHONY: client server all clean realclean test fmt vet site
