---
date: 2020-12-27
title: "Concurrency Patterns"
---

**Fan-In** multiplexes multiple input channels onto one output channel.

```go
func Funnel(sources ...<-chan int) <-chan int {
    dest := make(chan int)                  // The shared output channel

    var wg sync.WaitGroup                   // Used to automatically close dest
                                            // when all sources are closed

    wg.Add(len(sources))                    // Increment the sync.WaitGroup

    for _, ch := range sources {            // Start a goroutine for each source
        go func(c <-chan int) {
            defer wg.Done()                 // Notify WaitGroup when c closes

            for n := range c {
                dest <- n
            }
        }(ch)
    }

    go func() {                             // Start a goroutine to close dest
        wg.Wait()                           // after all sources close
        close(dest)
    }()

    return dest
}
```

Fan-Out evenly distributes messages from an input channel to multiple output channels.

```go
func Split(source <-chan int, n int) []<-chan int {
    dests := make([]<-chan int, 0)          // Create the dests slice

    for i := 0; i < n; i++ {                // Create n destination channels
        ch := make(chan int)
        dests = append(dests, ch)

        go func() {                         // Each channel gets a dedicated
            defer close(ch)                 // goroutine that competes for reads

            for val := range source {
                ch <- val
            }
        }()
    }

    return dests
}
```

Future provides a placeholder for a value that’s not yet known.

```go
type Future interface {
    Result() (string, error)
}

type InnerFuture struct {
    once sync.Once
    wg   sync.WaitGroup

    res   string
    err   error
    resCh <-chan string
    errCh <-chan error
}

func (f *InnerFuture) Result() (string, error) {
    f.once.Do(func() {
        f.wg.Add(1)
        defer f.wg.Done()
        f.res = <-f.resCh
        f.err = <-f.errCh
    })

    f.wg.Wait()

    return f.res, f.err
}

func SlowFunction(ctx context.Context) Future {
    resCh := make(chan string)
    errCh := make(chan error)

    go func() {
        select {
        case <-time.After(time.Second * 2):
            resCh <- "I slept for 2 seconds"
            errCh <- nil
        case <-ctx.Done():
            resCh <- ""
            errCh <- ctx.Err()
        }
    }()

    return &InnerFuture{resCh: resCh, errCh: errCh}
}
```

Sharding splits a large data structure into multiple partitions to localize
the effects of read/write locks.

```go
type Shard struct {
    sync.RWMutex                            // Compose from sync.RWMutex
    m map[string]interface{}                // m contains the shard's data
}

type ShardedMap []*Shard                    // ShardedMap is a *Shards slice

func NewShardedMap(nshards int) ShardedMap {
    shards := make([]*Shard, nshards)       // Initialize a *Shards slice

    for i := 0; i < nshards; i++ {
        shard := make(map[string]interface{})
        shards[i] = &Shard{m: shard}
    }

    return shards                           // A ShardedMap IS a *Shards slice!
}

func (m ShardedMap) getShardIndex(key string) int {
    checksum := sha1.Sum([]byte(key))       // Use Sum from "crypto/sha1"
    hash := int(checksum[17])               // Pick a random byte as our hash
    index := hash % len(shards)             // Mod by len(shards) to get index
}

func (m ShardedMap) getShard(key string) *Shard {
    index := m.getShardIndex(key)
    return m[index]
}

func (m ShardedMap) Get(key string) interface{} {
    shard := m.getShard(key)
    shard.RLock()
    defer shard.RUnlock()

    return shard.m[key]
}

func (m ShardedMap) Set(key string, value interface{}) {
    shard := m.getShard(key)
    shard.Lock()
    defer shard.Unlock()

    shard.m[key] = value
}

func (m ShardedMap) Keys() []string {
    keys := make([]string, 0)               // Create an empty keys slice
    wg := sync.WaitGroup{}                  // Create a wait group and add a
    wg.Add(len(m))                          // wait value for each slice
    for _, shard := range m {               // Run a goroutine for each slice
        go func(s *Shard) {
            s.RLock()                       // Establish a read lock on s
            for key, _ := range s.m {       // Get the slice's keys
                keys = append(keys, key)
            }
            s.RUnlock()                     // Release the read lock
            wg.Done()                       // Tell the WaitGroup it's done
        }(shard)
    }
    wg.Wait()                               // Block until all reads are done
    return keys                             // Return combined keys slice
}
```
