package main

import (
	"fmt"
	"os"
	"time"

	"github.com/syncsynchalt/illustrated-tls/fakerand"
	tls "github.com/syncsynchalt/illustrated-tls/tlscopy"
)

var serverKey = []byte(`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAxIA2BrrnR2sIlATsp7aRBD/3krwZ7vt9dNeoDQAee0s6SuYP
6MBx/HPnAkwNvPS90R05a7pwRkoT6Ur4PfPhCVlUe8lV+0Eto3ZSEeHz3HdsqlM3
bso67L7Dqrc7MdVstlKcgJi8yeAoGOIL9/igOv0XBFCeznm9nznx6mnsR5cugw+1
ypXelaHmBCLV7r5SeVSh57+KhvZGbQ2fFpUaTPegRpJZXBNS8lSeWvtOv9d6N5UB
ROTAJodMZT5AfX0jB0QB9IT/0I96H6BSENH08NXOeXApMuLKvnAf361rS7cRAfRL
rWZqERMP4u6Cnk0Cnckc3WcW27kGGIbtwbqUIQIDAQABAoIBAGF7OVIdZp8Hejn0
N3L8HvT8xtUEe9kS6ioM0lGgvX5s035Uo4/T6LhUx0VcdXRH9eLHnLTUyN4V4cra
ZkxVsE3zAvZl60G6E+oDyLMWZOP6Wu4kWlub9597A5atT7BpMIVCdmFVZFLB4SJ3
AXkC3nplFAYP+Lh1rJxRIrIn2g+pEeBboWbYA++oDNuMQffDZaokTkJ8Bn1JZYh0
xEXKY8Bi2Egd5NMeZa1UFO6y8tUbZfwgVs6Enq5uOgtfayq79vZwyjj1kd29MBUD
8g8byV053ZKxbUOiOuUts97eb+fN3DIDRTcT2c+lXt/4C54M1FclJAbtYRK/qwsl
pYWKQAECgYEA4ZUbqQnTo1ICvj81ifGrz+H4LKQqe92Hbf/W51D/Umk2kP702W22
HP4CvrJRtALThJIG9m2TwUjl/WAuZIBrhSAbIvc3Fcoa2HjdRp+sO5U1ueDq7d/S
Z+PxRI8cbLbRpEdIaoR46qr/2uWZ943PHMv9h4VHPYn1w8b94hwD6vkCgYEA3v87
mFLzyM9ercnEv9zHMRlMZFQhlcUGQZvfb8BuJYl/WogyT6vRrUuM0QXULNEPlrin
mBQTqc1nCYbgkFFsD2VVt1qIyiAJsB9MD1LNV6YuvE7T2KOSadmsA4fa9PUqbr71
hf3lTTq+LeR09LebO7WgSGYY+5YKVOEGpYMR1GkCgYEAxPVQmk3HKHEhjgRYdaG5
lp9A9ZE8uruYVJWtiHgzBTxx9TV2iST+fd/We7PsHFTfY3+wbpcMDBXfIVRKDVwH
BMwchXH9+Ztlxx34bYJaegd0SmA0Hw9ugWEHNgoSEmWpM1s9wir5/ELjc7dGsFtz
uzvsl9fpdLSxDYgAAdzeGtkCgYBAzKIgrVox7DBzB8KojhtD5ToRnXD0+H/M6OKQ
srZPKhlb0V/tTtxrIx0UUEFLlKSXA6mPw6XDHfDnD86JoV9pSeUSlrhRI+Ysy6tq
eIE7CwthpPZiaYXORHZ7wCqcK/HcpJjsCs9rFbrV0yE5S3FMdIbTAvgXg44VBB7O
UbwIoQKBgDuY8gSrA5/A747wjjmsdRWK4DMTMEV4eCW1BEP7Tg7Cxd5n3xPJiYhr
nhLGN+mMnVIcv2zEMS0/eNZr1j/0BtEdx+3IC6Eq+ONY0anZ4Irt57/5QeKgKn/L
JPhfPySIPG4UmwE4gW8t79vfOKxnUu2fDD1ZXUYopan6EckACNH/
-----END RSA PRIVATE KEY-----
`)

var serverCert = []byte(`-----BEGIN CERTIFICATE-----
MIIDITCCAgmgAwIBAgIIFVqSrcIEj5AwDQYJKoZIhvcNAQELBQAwIjELMAkGA1UE
BhMCVVMxEzARBgNVBAoTCkV4YW1wbGUgQ0EwHhcNMTgxMDA1MDEzODE3WhcNMTkx
MDA1MDEzODE3WjArMQswCQYDVQQGEwJVUzEcMBoGA1UEAxMTZXhhbXBsZS51bGZo
ZWltLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMSANga650dr
CJQE7Ke2kQQ/95K8Ge77fXTXqA0AHntLOkrmD+jAcfxz5wJMDbz0vdEdOWu6cEZK
E+lK+D3z4QlZVHvJVftBLaN2UhHh89x3bKpTN27KOuy+w6q3OzHVbLZSnICYvMng
KBjiC/f4oDr9FwRQns55vZ858epp7EeXLoMPtcqV3pWh5gQi1e6+UnlUoee/iob2
Rm0NnxaVGkz3oEaSWVwTUvJUnlr7Tr/XejeVAUTkwCaHTGU+QH19IwdEAfSE/9CP
eh+gUhDR9PDVznlwKTLiyr5wH9+ta0u3EQH0S61mahETD+Lugp5NAp3JHN1nFtu5
BhiG7cG6lCECAwEAAaNSMFAwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsG
AQUFBwMCBggrBgEFBQcDATAfBgNVHSMEGDAWgBSJT95bzGniUs8+owDfsZe4HeHB
RjANBgkqhkiG9w0BAQsFAAOCAQEAWRZFppouN3nk9t0nGrocC/1s11WZtefDblM+
/zZZCEMkyeelBAedOeDUKYf/4+vdCcHPHZFEVYcLVx3Rm98dJPi7mhH+gP1ZK6A5
jN4R4mUeYYzlmPqW5Tcu7z0kiv3hdGPrv6u45NGrUCpU7ABk6S94GWYNPyfPIJ5m
f85a4uSsmcfJOBj4slEHIt/tl/MuPpNJ1MZsnqY5bXREYqBrQsbVumiOrDoBe938
jiz8rSfLadPM3KKAQURl0640jODzSrL7nGGDcTErGRBBZBwjfxGl1lyETwQEhJk4
cSuVntaFvFxd1kXtGZCUc0ApJty0DjRpoVlB6OLMqEu2CEY2oA==
-----END CERTIFICATE-----
`)

var fakeRandData = []byte{
	0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f,
	0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f,
	0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x7b, 0x7c, 0x7d, 0x7e, 0x7f,
	0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x8b, 0x8c, 0x8d, 0x8e, 0x8f,
	0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f,
	0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xab, 0xac, 0xad, 0xae, 0xaf,
	0xb0, 0xb1, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf,
	0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf,
	0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf,
	0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
	0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff,
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

// a server that starts a TLS connection on port 8443, reads "ping", and responds "pong".
func main() {

	cert, err := tls.X509KeyPair(serverCert, serverKey)
	if err != nil {
		panic(err)
	}

	rand := fakerand.New(fakeRandData)
	ln, err := tls.Listen("tcp", ":8443", &tls.Config{
		Rand:         rand,
		Time:         func() time.Time { return time.Unix(1538708249, 0) },
		Certificates: []tls.Certificate{cert},
		KeyLogWriter: &keyWriter{},
	})
	if err != nil {
		panic(err)
	}

	conn, err := ln.Accept()
	if err != nil {
		panic(err)
	}

	rdata := make([]byte, 1024)
	n, err := conn.Read(rdata)
	fmt.Println("\nread data:", string(rdata[:n]))
	if err != nil {
		panic(err)
	}

	wdata := []byte("pong")
	n, err = conn.Write(wdata)
	fmt.Println("wrote data:", string(wdata[:n]))
	if err != nil {
		panic(err)
	}

	n, tot := rand.Stats()
	fmt.Printf("Used %d of %d rand bytes\n", n, tot)
}
