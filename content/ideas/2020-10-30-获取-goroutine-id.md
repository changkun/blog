---
date: 2020-10-30T00:00:00
title: "获取 Goroutine ID"
---

可能是具有 Go 1 兼容性保障的全版本获取 gorountine ID 的最快的实现

```go
// Get returns the ID of current goroutine.
//
// This implementation based on the facts that
// runtime.Stack gives information like:
//
//   goroutine 18446744073709551615 [running]:
//   github.com/changkun/goid.Get...
//
// This format stands for more than 10 years.
// Since commit 4dfd7fdde5957e4f3ba1a0285333f7c807c28f03,
// a goroutine id ends with a white space.
//
// Go 1 compatability promise garantees all
// versions of Go can use this function.
func Get() (id uint64) {
	var buf [30]byte
	runtime.Stack(buf[:], false)
	for i := 10; buf[i] != ' '; i++ {
		id = id*10 + uint64(buf[i]&15)
	}
	return id
}
```
