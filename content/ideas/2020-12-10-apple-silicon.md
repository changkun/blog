---
date: 2020-12-10T00:00:00+01:00
title: "Apple Silicon"
---

Go在darwin/arm64上的编译性能怎么样？我很不严谨的粗略比较了Intel Mac 和 M1 Mac 的 Go 编译性能。这个编译报告由如下指令生成:

$ go build -gcflags=‘-bench=bench.out’ -a
$ cat bench.out

其中-a用于禁用编译缓存。

MacBook Air (M1, 2020), Apple M1, 16 GB:

```
commit: devel +7716a2fbb7 Sun Nov 22 11:44:49 2020 -0500
goos: darwin
goarch: arm64
BenchmarkCompile:main:fe:init              1     305167 ns/op     17.86 %
BenchmarkCompile:main:fe:loadsys           1     164916 ns/op      9.65 %
BenchmarkCompile:main:fe:parse             1     199209 ns/op     11.66 %    23 lines    115457 lines/s
BenchmarkCompile:main:fe:typecheck:top1    1       7625 ns/op      0.45 %
BenchmarkCompile:main:fe:typecheck:top2    1       2375 ns/op      0.14 %
BenchmarkCompile:main:fe:typecheck:func    1      34000 ns/op      1.99 %     1 funcs     29412 funcs/s
BenchmarkCompile:main:fe:capturevars       1        250 ns/op      0.01 %
BenchmarkCompile:main:fe:inlining          1       9500 ns/op      0.56 %
BenchmarkCompile:main:fe:escapes           1       5834 ns/op      0.34 %
BenchmarkCompile:main:fe:xclosures         1      49583 ns/op      2.90 %
BenchmarkCompile:main:fe:subtotal          1     778459 ns/op     45.56 %
BenchmarkCompile:main:be:compilefuncs      1     279125 ns/op     16.34 %     1 funcs      3583 funcs/s
BenchmarkCompile:main:be:externaldcls      1        500 ns/op      0.03 %
BenchmarkCompile:main:be:dumpobj           1     639667 ns/op     37.44 %
BenchmarkCompile:main:be:subtotal          1     919292 ns/op     53.81 %
BenchmarkCompile:main:unaccounted          1      10791 ns/op      0.63 %
BenchmarkCompile:main:total                1    1708542 ns/op    100.00 %
```

Mac mini (2018), 3 GHz 6-Core Intel Core i5, 8 GB 2667 MHz DDR4:

```
commit: go1.15.6
goos: darwin
goarch: amd64
BenchmarkCompile:main:fe:init              1     333752 ns/op     15.31 %
BenchmarkCompile:main:fe:loadsys           1     246343 ns/op     11.30 %
BenchmarkCompile:main:fe:parse             1     372343 ns/op     17.08 %    23 lines    61771 lines/s
BenchmarkCompile:main:fe:typecheck:top1    1      19620 ns/op      0.90 %
BenchmarkCompile:main:fe:typecheck:top2    1       7347 ns/op      0.34 %
BenchmarkCompile:main:fe:typecheck:func    1      23073 ns/op      1.06 %     1 funcs    43341 funcs/s
BenchmarkCompile:main:fe:capturevars       1        238 ns/op      0.01 %
BenchmarkCompile:main:fe:inlining          1      13277 ns/op      0.61 %
BenchmarkCompile:main:fe:escapes           1      19283 ns/op      0.88 %
BenchmarkCompile:main:fe:xclosures         1     102213 ns/op      4.69 %
BenchmarkCompile:main:fe:subtotal          1    1137489 ns/op     52.19 %
BenchmarkCompile:main:be:compilefuncs      1     598194 ns/op     27.45 %     1 funcs     1672 funcs/s
BenchmarkCompile:main:be:externaldcls      1        766 ns/op      0.04 %
BenchmarkCompile:main:be:dumpobj           1     415450 ns/op     19.06 %
BenchmarkCompile:main:be:subtotal          1    1014410 ns/op     46.54 %
BenchmarkCompile:main:unaccounted          1      27696 ns/op      1.27 %
BenchmarkCompile:main:total                1    2179595 ns/op    100.00
```
