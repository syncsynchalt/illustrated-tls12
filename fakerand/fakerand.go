// fakerand implements an io.Reader which returns the same bytestream over and over again
package fakerand

// FakeRand is an io.Reader that supplies the same repeated 'random' bytes on Read().
type FakeRand struct {
	data    []byte
	index   int
	numRead int
}

func min(a, b int) int {
	if a < b {
		return a
	} else {
		return b
	}
}

// FakeRand.Read() supplies the same repeated block of bytes on each read
func (block *FakeRand) Read(buf []byte) (n int, err error) {
	n = 0
	for len(buf) > 0 {
		copied := copy(buf, block.data[block.index:])
		n += copied
		block.index += copied
		block.numRead += copied
		if block.index == len(block.data) {
			block.index = 0
		}
		buf = buf[copied:]
	}
	return n, nil
}

func (block *FakeRand) Stats() (read, total int) {
	return block.numRead, len(block.data)
}

func New(data []byte) *FakeRand {
	return &FakeRand{
		data: data,
	}
}
