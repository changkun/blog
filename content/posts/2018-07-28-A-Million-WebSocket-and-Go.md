---
date: "2018-07-28 16:47:09"
toc: true
id: 254
slug: /posts/a-million-websocket-and-go
aliases:
    - /archives/2018/07/254/
tags:
    - Go
    - WebSocket
title: A Million WebSocket and Go
---

本文介绍了如何使用 Go 语言开发高负载的 WebSocket 服务。如果你对 WebSocket 非常熟悉，但并不了解 Go 语言，我希望你仍然能对此文所介绍的一些优化技术感兴趣。

<!--more-->

## 简介

我们先来描述一下问题本身。

考虑用户邮件的存储系统。有很多方法可以在系统内对状态变化进行持续追踪（新邮件），比如系统事件是一种方式，另一种方法则可以通过定期的系统轮询或有关其状态变化的。

两种方法各有利弊。但当我们讨论到邮件时，用户希望收到新邮件的速度越快越好。邮件轮询每秒约有 50,000 个 HTTP 请求，其中 60% 返回 304 状态，即邮箱内没有任何修改。

因此，为了减少服务器上的负载并加快向用户传递邮件的速度，我们决定通过编写 publisher-subscriber 服务器（即 bus, message broker, event channel）来重新发明轮子。一方面接受有关状态更改的通知，另一方面接受此类通知的订阅。

改进前：

```
+---


---


---


---


--+     (2)    +---


---


---


---


-+      (1)    +---


---


---


--+
|              | <---


---


--+ |             |  <---


---


--+ |           |
|    Storage   |            |     API     |     HTTP    |  Browser  |
|              | +---


---


--> |             |  +---


---


--> |           |
+---


---


---


---


--+     (3)    +---


---


---


---


-+      (4)    +---


---


---


--+
```

改进后：

```
+---


---


---


---


--+            +---


---


---


---


-+   WebSocket  +---


---


---


--+
|    Storage   |            |     API     | +---


---


---


-> |  Browser  |
+---


---


---


---


--+            +---


---


---


---


-+      (3)     +---


---


---


--+
       +                           ^
       | (1)                       | (2)
       v                           +
+---


---


---


---


---


---


---


---


---


---


---


---


---


--+
|                  Bus                    |
+---


---


---


---


---


---


---


---


---


---


---


---


---


--+
```

第一个方案显示了改进前的情况。浏览器定期轮询 API 并询问存储（邮箱服务）更改。

第二种方案描述了新的架构。浏览器与通知 API 建立 WebSocket 连接，通知 API 是总线服务器的客户端。收到新的电子邮件后，Storage 会将有关它的通知发送到总线(1)，并将总线发送给其订户(2)。API 确定发送接收通知的连接，并将其发送到用户的浏览器(3)。

所以，今天我们将讨论 API 或 WebSocket 服务器。在最后，我会告诉你，这个服务器能够保持三百万的在线连接。

## 常见方式

我们来看看在没有任何优化的情况下使用普通 Go 功能实现服务器的某部分。在我们继续使用 `net/http` 之前，先来看看如何发送和接受数据。基于 WebSocket 协议的数据（例如 JSON 对象）在上下文中称之为分组 (*packets*)。

我们先开始实现 `Channel` 包含通过 WebSocket 连接发送和接受此类数据包的逻辑结构。

### Channel struct

```go
// Packet represents application level data.
type Packet struct {
    
}

// Channel wraps user connection.
type Channel struct {
    conn net.Conn    // WebSocket connection
    send chan Packet // Outgoing packets queue
}

func NewChannel(conn net.Conn) *Channel {
    c := &Channel{
        conn: conn,
        send: make(chan Packet, N),
    }
    go c.reader()
    go c.writer()
	return c
}
```

我想请你提起对两个关于读写的 goroutine 的注意。每个 goroutine 需要自己的内存栈，初始大小为 2~8KB（取决于操作系统）和 Go 版本。

根据上面提到的三百万在线连接的数量，我们需要 24GB 的内存（设堆栈为 4KB）来用于存储所有连接。而且没有为 Channel 结构，传出数据包 `ch.send` 和其他内部字段分配内存。

### I/O goroutine

我们来看看 `reader` 的实现：

```go
func (c *Channel) reader() {
    // We make a buffered read to reduce read syscalls.
    buf := bufio.NewReader(c.conn)
    for {
        pkt, _ := readPacket(buf)
        c.handle(pkt)
    }
}
```

这里我们使用 `bufio.Reader` 来减少 `read()` 系统调用的数量，并读取 `buf` 缓冲区大小允许的数量。在无限循环中，我们_期待新数据的到来_。注意：是_期待新数据的到来_，我们一会儿再仔细讨论这一点。

我们不考虑传入数据包的解析和处理，因为它对我们将讨论的优化并不重要。但是，`buf` 现在值得我们注意：默认情况下，它为 4KB，这意味着我们的连接还剩余 12 GB 内存没有使用。同样的，我们可以实现 `writer`：

```go
func (c *Channel) writer() {
    // we make buffered write to reduce write syscalls.
    buf := bufio.NewWriter(c.conn)
    
    for pkt := range c.send {
        _ := writePacket(buf, pkt)
        buf.Flush()
    }
}
```

### HTTP

我们已经写好了一个简单的 `Channel` 实现，现在我们需要制造一个 WebSocket 连接来协同工作。由于我们任然处于_常见做法_一节中，因此我们不妨也用常见的方式来完成。

注意：如果你不知道 WebSocket 的工作原理，值得一提的就是客户端通过一个特殊的 HTTP Upgrade 机制来切换到 WebSocket 协议。成功处理 Upgrade 请求后，服务器和客户端将使用 TCP 连接来交换 Websocket 的二进制帧。[这里](https://tools.ietf.org/html/rfc6455#section-5.2) 给出了连接内帧结构的描述。

```go
import (
    "net/http"
    "some/websocket"
)

http.HandleFunc("/v1/ws", func(w http.ResponseWriter, r *http.Request) {
    conn, _ := websocket.Upgrade(r, w)
    ch := NewChannel(conn)
    // ...
})
```

请注意，`http.ResponseWriter` 会为 `bufio.Reader` 和 `bufio.Writer`  分配内存（各需要 4KB 的缓存）来初始化 `*http.Request` 和之后的响应写入。

无论使用哪种 WebSocket 库，在成功响应 Upgrade 请求后，在 `responseWriter.Hijack()` 调用后[服务器会收到](https://github.com/golang/go/blob/143bdc27932451200f3c8f4b304fe92ee8bba9be/src/net/http/server.go#L1862-L1869) IO 缓存和 TCP 连接。

提示：在某些情况下，`go:linkname` 可以使用 `net/http.putBufio{Read,Writer}` 将缓存返回给 `net/http` 内部的  `sync.Pool` 。

因此，我们还需要 24 GB 内存来支撑三百万的链接。

终上所述，我们需要 72GB 内存来支撑一个什么都还没做的应用。

## 优化

我们来回顾一下我们介绍部分中讨论的内容，并记住用户连接的行为方式。切换到 WebSocket 后，客户端发送包含相关事件的数据包，或者说订阅事件。然后（不考虑诸如技术消息 `ping/pong`），客户端可以在整个生命周期中不发送任何其他内容。连接寿命可能持续几秒到几天。

因此对于大多数的时间来说，我们的 `Channel.reader()` 和 `Channel.writer()` 在等待数据的处理用于接受或发送。与他们一起等待的是每个 4KB 的 IO 缓存。

### Netpoll

你还记得通过锁定内部的呼叫来预期新数据的 `Channel.reader()` 的实现吗？如果连接中有数据，Go 运行时会唤醒我们的 goroutine 并允许它读取下一个数据包。之后，goroutine 再次锁定，同时期待新的数据。让我们看看 Go 运行时如何理解 `conn.Read()` 和 `bufio.Reader.Read()` goroutine 必须『被唤醒』这一过程。

如果我们查看 `conn.Read()` 的[实现](https://github.com/golang/go/blob/release-branch.go1.8/src/net/net.go#L176-L186)，我们会看到内部有一个 `bufio.Reader.Read()` [调用](https://github.com/golang/go/blob/release-branch.go1.8/src/net/fd_unix.go#L245-L257)：

```go
// net/fd_unix.go

func (fd *netFD) Read(p []byte) (n int, err error) {
    // ...
    for {
        n, err = syscall.Read(fd.sysfd, p)
        if err != nil {
            n = 0
            if err == syscall.EAGAIN {
                if err = fd.pd.waitRead(); err == nil {
                    continue
                }
            }
        }
        // ...
        break
    }
    // ...
}
```

Go 使用了非阻塞式 socket 模式。EAGAIN 表明了如果 socket 中没有数据，并在空 socket 中读取时不会被锁定，OS 会将控制权返回给我们。

我们看到，一个 `read()` 系统调用读取一个连接的文件描述符。如果读调用返回了一个 [EAGAIN 错误](http://man7.org/linux/man-pages/man2/read.2.html#ERRORS)，运行时会执行一个 `pollDesc.waitRead()` [调用](https://github.com/golang/go/blob/release-branch.go1.8/src/net/fd_poll_runtime.go#L74-L81)：

```go
// net/fd_poll_runtime.go

func (pd *pollDesc) waitRead() error {
    return pd.wait('r')
}
func (pd *pollDesc) wait(mode int) error {
    res := runtime_pollWait(pd.runtimeCtx, mode)
}
```

如果我们深入挖掘，会发现 netpoll 在 Linux 中使用 epoll 而在 BSD 中使用 kqueue 进行实现。为什么不使用相同的方法来处理我们的连接呢？我们可以分配一个读取缓存，并在 需要时启动读 goroutine：当确实有可读的数据时。

在 `github.com/golang/go` 中由一个 [issue](https://github.com/golang/go/issues/15735#issuecomment-266574151) 讨论了导出 netpoll 相关函数。

### 摆脱 goroutines

假设我们实现了 [Go 版本的 netpoll](https://godoc.org/github.com/mailru/easygo/netpoll)。现在我们可以启动一个没有内建缓存的  `Channel.reader()` goroutine 了，同时还能订阅连接中刻度的数据：

```go
ch := NewChannel(conn)

// Make conn to be observed by netpoll instance.
poller.Start(conn, netpoll.EventRead, func() {
    // We spawn goroutine here to prevent poller wait loop
    // to become locked during receiving packet from ch
    go Receive(ch)
})

func (ch *Channel) Receive() {
    buf := bufio.NewReader(ch.conn)
    pkt := readPacket(buf)
    c.handle(pkt)
}
```

对于 `Channel.writer()` 相对简单，因为我们可以仅在发送 packet 时再运行 goroutine 并分配缓存：

```go
func (ch *Channel) Send(p Packet) {
    if c.noWriterYet() {
        go ch.writer()
    }
    ch.send <- p
}
```

注意，我们没有处理当操作系统在 `write()` 系统调用时候返回 `EAGAIN` 的情况。并依赖 Go 运行时来处理这种情况，因为对于这种类型的服务器，这种情况是很少发生的。无论如何它可以用相同的方式进行处理。

从 `ch.send` （或好几个）读取对外的 packet 后，writer 会完成它的操作并释放 goroutine 栈以及发送缓存。

完美！我们通过摆脱栈与两个同时运行的 goroutine 的 IO 缓存节约了 48 GB 的内存。

### 资源控制

大量连接不仅会消耗大量内存，在开发服务端时，我们还会遇到 race condition 和 deadlocks。进而就是 self-DDOS。这种情况下，客户端会尝试重连服务端并让情况变得更加糟糕。

例如，某种原因我们无法处理 `ping/pong` 消息，这些空闲连接会不断被关闭（他们会以为这些连接已经无效因此不会收到数据）。然后客户端每秒就会以为时区了连接并尝试重新连接，而不是继续等待服务端发来的消息。

这种情况下，解决方法是让过载的服务端停止接受新的链接，这样负载均衡（nginx）就可以把请求转移到其他服务端去。

撇开服务端负载不说，如果所有客户端突然向服务端发送一个 packet，我们之前节省的 48GB 内存就会被消耗掉，因此我们又会像开始那样，给每个连接创建 goroutine 并分配缓存。

#### goroutine 池

于是我们可以通过 goroutine 池来限制 packet 被同时处理的数量。

```go
package gopool

func New(size int) *Pool {
    reutrn &Pool{
        work: make(chan func()),
        sem:  make(chan struct{}, size),
    }
}

func (p *Pool) Schedule(task func()) error {
    select {
    case p.work <- task:
    case p.sem <- struct{}{}:
        go p.worker(task)    
    }
}

func (p *Pool) worker(task func()) {
    defer func() { <- p.sem }
    for {
        task()
        task = <- p.work
    }
}
```

现在我们可以和 `netpool` 共同协作了：

```go
pool := gopool.New(128)
pooler.Start(conn, netpool.EventRead, func() {
    // We will block pooler wait loop when all pool workers are busy
    pool.Schedule(func() {
        Receive(ch)
    })
})
```

现在我们不仅要等待可读数据出现在 socket 中才去读取 packet，同时还必须等到 goroutine 池里获取到空闲的 goroutine。类似的，我们可以修改 `Send()`：

```go
pool := gopool.New(128)
func (ch *Channel) Send(p Packet) {
    if c.noWriterYet() {
        pool.Schedule(ch.writer)
    }
    ch.send <- p
}
```

我们没有调用 `go ch.writer()`，而是利用 goroutine 池来发送数据。因此，如果一个池包含了 `N` 个 goroutine，我们可以保证 `N` 个请求被同时处理。而 `N+1` 个请求不会分配 `N+1` 个缓存。goroutine 池允许我们限制对新连接 `Accept()` 和 `Upgrade()`，进而避免了大部分 DDos 的情况。

### 零拷贝 Upgrade

前面我们已经提到过，客户端通过 HTTP Upgrade 来切换到 WebSocket 协议。下面是一个 Upgrade 请求：

```
GET /ws HTTP/1.1
Host: Mail.Ru
Connection: Upgrade
Sec-Websocket-Key: A3xNe7sEB9HixkmBhVrYaA==
Sec-Websocket-Version: 13
Upgrade: websocket

HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Sec-Websocket-Accept: ksu0wXWG+YmkVx+KQR2agP0cQn4=
Upgrade: websocket
```

我们接受 HTTP 请求和它的头部只是为了切换到 WebSocket 协议，而 `http.Request` 里保存了所有头部的数据。从这里可以得到启发，如果是为了优化，我们可以放弃使用标准的 `net/http` 服务并在处理 HTTP 请求时避免无用的内存分配和拷贝。

> 例如，`http.Request` 包含了 Header 字段。标准的 `net/http` 会将请求中的所有 header 数据无条件拷贝到 Header 字段里。你可以想象这个字段会保存很多荣誉数据，例如一个包含很长的 cookie header

那么如何优化呢？

####  WebSocket 实现

可惜的是，我们优化服务端的时候所能找到的库只支持对标准 `net/http` 服务做升级。而且没有一个库允许我们事先上面提到的读写优化。为了使这些优化成为可能，我们必须由一套底层 API 来操作 WebSocket。为了重用缓存，我们需要实现下面的协议函数：

```go
func ReadFrame(ioReader) (Frame, error)
func WriteFrame(io.Writer, Frame) error
```

如果我们有一个包含这样 API 的库，就可以按照下面的方式从连接上读取 packet：

```go
// getReadBuf, putReadBuf are intended to 
// reuse *bufio.Reader (with sync.Pool for example).
func getReadBuf(io.Reader) *bufio.Reader
func putReadBuf(*bufio.Reader)

// readPacket must be called when data could be read from conn.
func readPacket(conn io.Reader) error {
    buf := getReadBuf()
    defer putReadBuf(buf)

    buf.Reset(conn)
    frame, _ := ReadFrame(buf)
    parsePacket(frame.Payload)
    //...
}
```

简单来说就是我们要自己写一个库。

#### github.com/gobwas/ws

`ws` 库的主要涉及思想是不将协议的操作逻辑暴露给用户。所有读写函数都接受通用的 `io.Reader` 和 `io.Writer` 接口。因此它可以随意搭配是否使用缓存以及其他 IO 库。

除了标准库 `net/http` 里的 Upgrade 请求，`ws` 还支持零拷贝 Upgrade。它能处理 Upgrade 请求并切换到 WebSocket 模式而不产生任何内存分配或拷贝。`ws.Upgrade()` 接受 `io.ReadWriter`（`net.Conn` 实现了这个接口）。换句话说，我们可以使用 标准的 `net.Listen()` 函数后把从 `In.Accept()` 收到的链接马上交给 `ws.Upgrade()` 去处理。库也允许拷贝任何请求数据来满足将来应用的需求（举个例子，拷贝 `Cookie` 来验证一个 session）。

下面是处理升级请求的性能测试：标准 `net/http` 库的实现和使用零拷贝升级的 `net.Listen()`：

```
BenchmarkUpgradeHTTP    5156 ns/op    8576 B/op    9 allocs/op
BenchmarkUpgradeTCP     973 ns/op     0 B/op       0 allocs/op
```

使用 `ws` 以及零拷贝 Upgrade 为我们节约了 24GB 的空间。这些空间原本是 `net/http` 中用来处理请求 IO 缓存的。

### 回顾

回顾一下我们做过的优化：

- 一个包含缓存的读 goroutine 会占用很多内存。方案：netpoll（epoll, kqueue）缓存复用
- 一个包含缓存的写 goroutine 会占用很多内存。方案：需要时创建 goroutine，缓存复用
- 存在大量连接请求时，netpoll 不能很好的限制连接数。方案：复用 goroutine 并限制数量
- `net/http` 对 WebSocket 的 Upgrade 请求处理并不是最高效的。方案：在 TCP 连接上实现零拷贝 Upgrade。

下面是服务端大致的实现代码：

```go
import (
    "net"
    "github.com/gobwas/ws"
)

ln, _ := net.Listen("tcp", ":8080")

for {
    // Try to accept incoming connection inside free pool worker.
    // If there no free workers for 1ms, do not accept anything and try later.
    // This will help us to prevent many self-ddos or out of resource limit cases.
    err := pool.ScheduleTimeout(time.Millisecond, func() {
        conn := ln.Accept()
        _ = ws.Upgrade(conn)

        // Wrap WebSocket connection with our Channel struct.
        // This will help us to handle/send our app's packets.
        ch := NewChannel(conn)

        // Wait for incoming bytes from connection.
        poller.Start(conn, netpoll.EventRead, func() {
            // Do not cross the resource limits.
            pool.Schedule(func() {
                // Read and handle incoming packet(s).
                ch.Recevie()
            })
        })
    })
    if err != nil {   
        time.Sleep(time.Millisecond)
    }
}
```

## 结论

过早优化是万恶之源。上面的优化是有意义的，但不适用于所有情况。例如，如果空闲资源（内存，CPU）与在线连接数之间的比例很高的话，优化就没有太多意义。当然，知道什么地方可以优化以及如何优化总是有帮助的。

## 参考

- https://medium.freecodecamp.org/million-websockets-and-go-cc58418460bb
- https://github.com/mailru/easygo
- https://github.com/gobwas/ws
- https://github.com/gobwas/ws-examples
- https://github.com/gobwas/httphead