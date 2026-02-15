---
date: 2020-12-26
title: "Stability Patterns"
---

**Circuit Breaker** automatically degrades service functions in response to
a likely fault, preventing larger or cascading failures by eliminating
recurring errors and providing reasonable error responses.

```go
type Circuit func(context.Context) (string, error)
 
// Breaker wraps a circuit with a given failure threashould.
func Breaker(circuit Circuit, failureThreshold uint64) Circuit {
    var lastStateSuccessful = true
    var consecutiveFailures uint64 = 0
    var lastAttempt time.Time = time.Now()

    return func(ctx context.Context) (string, error) {
        if consecutiveFailures >= failureThreshold {
            backoffLevel := consecutiveFailures - failureThreshold
            shouldRetryAt := lastAttempt.Add(time.Second * 2 << backoffLevel)

            if !time.Now().After(shouldRetryAt) {
                return "", errors.New("circuit open -- service unreachable")
            }
        }

        lastAttempt = time.Now()
        response, err := circuit(ctx)

        if err != nil {
            if !lastStateSuccessful {
                consecutiveFailures++
            }
            lastStateSuccessful = false
            return response, err
        }

        lastStateSuccessful = true
        consecutiveFailures = 0

        return response, nil
    }
}
```

**Debounce** limits the frequency of a function call to one among a cluster
of invocations.

```go
type Circuit func(context.Context) (string, error)

func DebounceFirst(circuit Circuit, d time.Duration) Circuit {
    var threshold time.Time
    var cResult string
    var cError error

    return func(ctx context.Context) (string, error) {
        if threshold.Before(time.Now()) {
            cResult, cError = circuit(ctx)
        }

        threshold = time.Now().Add(d)
        return cResult, cError
    }
}
func DebounceLast(circuit Circuit, d time.Duration) Circuit {
    var threshold time.Time = time.Now()
    var ticker *time.Ticker
    var result string
    var err error

    return func(ctx context.Context) (string, error) {
        threshold = time.Now().Add(d)

        if ticker == nil {
            ticker = time.NewTicker(time.Millisecond * 100)
            tickerc := ticker.C

            go func() {
                defer ticker.Stop()

                for {
                    select {
                    case <-tickerc:
                        if threshold.Before(time.Now()) {
                            result, err = circuit(ctx)
                            ticker.Stop()
                            ticker = nil
                            break
                        }
                    case <-ctx.Done():
                        result, err = "", ctx.Err()
                        break
                    }
                }
            }()
        }

        return result, err
    }
}
```

**Retry** accounts for a possible transient fault in a distributed system by transparently retrying a failed operation.

```go
type Effector func(context.Context) (string, error)

func Retry(effector Effector, retries int, delay time.Duration) Effector {
    return func(ctx context.Context) (string, error) {
        for r := 0; ; r++ {
            response, err := effector(ctx)
            if err == nil || r >= retries {
                return response, err
            }

            log.Printf("Attempt %d failed; retrying in %v", r + 1, delay)

            select {
            case <-time.After(delay):
            case <-ctx.Done():
                return "", ctx.Err()
            }
        }
    }
}
```

**Throttle** limits the frequency of a function call to some maximum number of invocations per unit of time.

```go
type Effector func(context.Context) (string, error)

func Throttle(e Effector, max uint, refill uint, d time.Duration) Effector {
    var ticker *time.Ticker = nil
    var tokens uint = max

    var lastReturnString string
    var lastReturnError error

    return func(ctx context.Context) (string, error) {
        if ctx.Err() != nil {
            return "", ctx.Err()
        }

        if ticker == nil {
            ticker = time.NewTicker(d)
            defer ticker.Stop()

            go func() {
                for {
                    select {
                    case <-ticker.C:
                        t := tokens + refill
                        if t > max {
                            t = max
                        }
                        tokens = t
                    case <-ctx.Done():
                        ticker.Stop()
                        break
                    }
                }
            }()
        }

        if tokens > 0 {
            tokens--
            lastReturnString, lastReturnError = e(ctx)
        }

        return lastReturnString, lastReturnError
    }
}
```

**Timeout** allows a process to stop waiting for an answer once it’s clear that an answer may not be coming.

```go
func Timeout(slowfunc func(interface{}) (interface{}, error),
    arg interface{}) func(context.Context) (interface{}, error) {
    chres := make(chan interface{})
    cherr := make(chan error)

    go func() {
        res, err := flowfunc(arg)
        chres <- res
        cherr <- err
    }()

    return func(ctx context.Context) (interface{}, error) {
        select {
        case res := <-chres:
            return res, <-cherr
        case <-ctx.Done():
            return "", ctx.Err()
        }
    }
}
```
