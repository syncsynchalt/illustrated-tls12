package fakerand_test

import (
	"fmt"
	"path/filepath"
	"reflect"
	"runtime"
	"testing"

	"github.com/syncsynchalt/illustrated-tls/fakerand"
)

// ok fails the test if an err is not nil.
func ok(tb testing.TB, err error) {
	if err != nil {
		_, file, line, _ := runtime.Caller(1)
		fmt.Printf("\033[31m%s:%d: unexpected error: %s\033[39m\n\n", filepath.Base(file), line, err.Error())
		tb.FailNow()
	}
}

// equals fails the test if exp is not equal to act.
func equals(tb testing.TB, exp, act interface{}) {
	if !reflect.DeepEqual(exp, act) {
		_, file, line, _ := runtime.Caller(1)
		fmt.Printf("\033[31m%s:%d:\n\n\texp: %#v\n\n\tgot: %#v\033[39m\n\n", filepath.Base(file), line, exp, act)
		tb.FailNow()
	}
}

func TestEmptyRead(t *testing.T) {
	fake := fakerand.New([]byte{0x01, 0x02, 0x03, 0x04})
	b := make([]byte, 0)
	n, err := fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{}, b)

	rd, tot := fake.Stats()
	equals(t, 0, rd)
	equals(t, 4, tot)
}

func TestPartialRead(t *testing.T) {
	fake := fakerand.New([]byte{0x01, 0x02, 0x03, 0x04})
	b := make([]byte, 1)
	n, err := fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x01}, b)

	rd, tot := fake.Stats()
	equals(t, 1, rd)
	equals(t, 4, tot)
}

func TestRepeatRead(t *testing.T) {
	fake := fakerand.New([]byte{0x01, 0x02, 0x03, 0x04})
	b := make([]byte, 1)
	n, err := fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x01}, b)

	n, err = fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x02}, b)

	rd, tot := fake.Stats()
	equals(t, 2, rd)
	equals(t, 4, tot)
}

func TestFullRead(t *testing.T) {
	fake := fakerand.New([]byte{0x01, 0x02, 0x03, 0x04})
	b := make([]byte, 4)
	n, err := fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x01, 0x02, 0x03, 0x04}, b)

	n, err = fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x01, 0x02, 0x03, 0x04}, b)

	rd, tot := fake.Stats()
	equals(t, 8, rd)
	equals(t, 4, tot)
}

func TestBeyondRead(t *testing.T) {
	fake := fakerand.New([]byte{0x01, 0x02, 0x03, 0x04})
	b := make([]byte, 7)
	n, err := fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x01, 0x02, 0x03, 0x04, 0x01, 0x02, 0x03}, b)

	n, err = fake.Read(b)
	ok(t, err)
	equals(t, n, len(b))
	equals(t, []byte{0x04, 0x01, 0x02, 0x03, 0x04, 0x01, 0x02}, b)

	rd, tot := fake.Stats()
	equals(t, 14, rd)
	equals(t, 4, tot)
}
