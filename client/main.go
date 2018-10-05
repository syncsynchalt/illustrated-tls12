package main

import (
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
	"time"

	"github.com/syncsynchalt/illustrated-tls/fakerand"
	tls "github.com/syncsynchalt/illustrated-tls/tlscopy"
)

var fakeRandData = []byte{
	0x56, 0x17, 0xe3, 0x58, 0xcd, 0x3c, 0x9f, 0x0a, 0xa7, 0xe5, 0x41, 0x0e, 0x97, 0x57, 0xae, 0x93,
	0xcd, 0xf2, 0x88, 0x82, 0xcc, 0x6e, 0xe8, 0xac, 0x33, 0x03, 0x1b, 0xed, 0x23, 0x36, 0x8b, 0xe8,
	0x46, 0x60, 0x2c, 0x14, 0x23, 0x20, 0x7a, 0x0b, 0x7b, 0x24, 0xc2, 0x28, 0xb5, 0x80, 0x79, 0xbf,
	0xbc, 0x77, 0x72, 0xc5, 0x29, 0xe7, 0x91, 0x9f, 0xe7, 0xc6, 0xc6, 0x43, 0xc4, 0x8a, 0xf9, 0x17,
	0xfe, 0xe8, 0xee, 0x9b, 0x9b, 0x9e, 0x71, 0x1f, 0xb2, 0x50, 0x7d, 0x35, 0xb3, 0xaa, 0x7e, 0x9e,
	0x47, 0x55, 0xb2, 0x17, 0x79, 0xc9, 0x74, 0x83, 0x0f, 0xf5, 0x52, 0xf1, 0xf9, 0x3d, 0x00, 0xc9,
	0x2c, 0x3f, 0xc4, 0x83, 0xdc, 0x36, 0xb0, 0x75, 0x75, 0x85, 0x8c, 0xcd, 0xf7, 0x95, 0xf2, 0xdb,
	0x3d, 0xad, 0xc0, 0x38, 0xee, 0x8a, 0x4c, 0x2c, 0x30, 0xd0, 0x79, 0xba, 0x3d, 0x01, 0x78, 0xa1,
	0x6e, 0xfd, 0x71, 0xa3, 0x5a, 0xe0, 0x2b, 0xf7, 0xe0, 0xde, 0xe0, 0x8c, 0x62, 0x49, 0x97, 0xfe,
	0x16, 0xbd, 0x38, 0xa1, 0x16, 0x1d, 0xeb, 0xbf, 0x4e, 0x93, 0x95, 0xb2, 0xe9, 0xe2, 0x98, 0x30,
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

var caCert = []byte(`-----BEGIN CERTIFICATE-----
MIIDATCCAemgAwIBAgIBATANBgkqhkiG9w0BAQsFADAiMQswCQYDVQQGEwJVUzET
MBEGA1UEChMKRXhhbXBsZSBDQTAeFw0xODEwMDUwMTM3NTVaFw0yODEwMDUwMTM3
NTVaMCIxCzAJBgNVBAYTAlVTMRMwEQYDVQQKEwpFeGFtcGxlIENBMIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw3KoKthct8kUhCr6IXt303X11BWDTVOD
Q82Y9ltNa3INXgUdg3pbFJc017d2bYsfxQ3ekcs/28P/lCn+wAc1IcJMTV0m5om3
l7khTZevI9PwIjtWOPnU1M4jlDelp+i0QxIT/vA02pM4xF5SpjMlBnhBxmKepxBY
RyKkCJqAKbTGYTCFvEa5Lg9lvEtROrhZ3EgnicyRDQBxeSfLxK3zZa++0TZOWEQ0
e5HfdfHdmBotiQ/LEQ8lbSnZqLRAzGhcoIVemJ8XcYIDLhYoTk2VYbfkyy0QGhDm
qBCIXFvWzrLm5/Ux+TUXpC3HQlEzvDTJLo/1/x4wKDVMcOYtVdQ5XwIDAQABo0Iw
QDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUiU/e
W8xp4lLPPqMA37GXuB3hwUYwDQYJKoZIhvcNAQELBQADggEBAGo5sILExEsBO7If
siOtHdz0HIi55hUDYZbkx0erO/+LHaeM3ufJoYMW+gQ+3xmJ74bqNsbibPbi2pzQ
wxd5+5K9BYsqY4XTdLxD1F8iEELFg04I+JB4tmzGpeTXEFY/lBNNRHbsKw7bTh+c
CkMyNfHDshAQOUJ5fTpiNF2MF96LRK1XwtLSpaffnLY1bvdKLMU0h6yKUpYaOizw
1H+XNuC6/vjPo7q92XiuCGgfyrfWap/U6DH1dWUrk+avvfJ7nzotgjx7ddssW4nP
z0Xbzt6dvZppaRceRTFIUyhES33qawZn1zLNdPBaprfkX3crzU7kzNpRnd+BaMBO
irkvU+w=
-----END CERTIFICATE-----
`)

// a client that connects to localhost:8443, writes "ping", and reads "pong"
func main() {

	conn, err := tls.Dial("tcp", "localhost:8443", &tls.Config{
		Rand:         fakerand.New(fakeRandData),
		Time:         func() time.Time { return time.Unix(1538708249, 0) },
		RootCAs:      buildCaList(),
		ServerName:   "example.ulfheim.net",
		KeyLogWriter: &keyWriter{},
	})
	if err != nil {
		panic(err)
	}

	wdata := []byte("ping")
	n, err := conn.Write(wdata)
	fmt.Println("\nwrote data:", string(wdata[:n]))
	if err != nil {
		panic(err)
	}

	rdata := make([]byte, 1024)
	n, err = conn.Read(rdata)
	fmt.Println("read data:", string(rdata[:n]))
	if err != nil {
		panic(err)
	}
}

func buildCaList() *x509.CertPool {
	caCertPem, _ := pem.Decode(caCert)
	caCert, err := x509.ParseCertificate(caCertPem.Bytes)
	if err != nil {
		panic(err)
	}
	caList := x509.NewCertPool()
	caList.AddCert(caCert)
	return caList
}
