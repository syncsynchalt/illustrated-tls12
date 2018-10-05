package main

import (
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/syncsynchalt/illustrated-tls/fakerand"
	tls "github.com/syncsynchalt/illustrated-tls/tlscopy"
)

var fakeRandData = []byte{
	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
	0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
	0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f,
	0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f,
	0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f,
}

// KeyWriter is an io.Writer meant to print the NSS key log to stdout
type keyWriter struct {
	hasWritten bool
}

func (kw *keyWriter) Write(b []byte) (n int, err error) {
	if !kw.hasWritten {
		os.Stdout.Write([]byte("# key log data follows:\n"))
		kw.hasWritten = true
	}
	return os.Stdout.Write(b)
}

// a client that connects to localhost:8443, writes "ping", and reads "pong"
func main() {

	rand := fakerand.New(fakeRandData)
	conn, err := tls.Dial("tcp", "localhost:8443", &tls.Config{
		Rand:         rand,
		Time:         func() time.Time { return time.Unix(1538708249, 0) },
		RootCAs:      buildCaList(),
		ServerName:   "example.ulfheim.net",
		KeyLogWriter: &keyWriter{},
	})
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	wdata := []byte("ping")
	n, err := conn.Write(wdata)
	fmt.Println("\nclient wrote data:", string(wdata[:n]))
	if err != nil {
		panic(err)
	}

	rdata := make([]byte, 1024)
	n, err = conn.Read(rdata)
	fmt.Println("client read data:", string(rdata[:n]))
	if err != nil {
		panic(err)
	}

	n, tot := rand.Stats()
	fmt.Printf("client used %d of %d rand bytes\n", n, tot)
}

func buildCaList() *x509.CertPool {
	caCertBytes, err := ioutil.ReadFile("ca.crt")
	if err != nil {
		panic(err)
	}
	caCertPem, _ := pem.Decode(caCertBytes)
	caCert, err := x509.ParseCertificate(caCertPem.Bytes)
	if err != nil {
		panic(err)
	}
	caList := x509.NewCertPool()
	caList.AddCert(caCert)
	return caList
}
