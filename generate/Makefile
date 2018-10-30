all: site

generator: ../cmd/generator/main.go
	go build ../cmd/generator

site: generator
	./generator < index.html.template > ../site/index.html
	./generator < certificate.html.template > ../site/certificate.html
	cp ../server/server.key ../site/files
	cp ../server/server.crt ../site/files

clean:
	rm -f generator
