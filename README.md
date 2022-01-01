# Changkun's Blog

_https://changkun.de/blog_

The source code.

## Build

```sh
$ go install github.com/gohugoio/hugo@latest
$ docker network create traefik_proxy
```

```sh
$ make
$ make s
$ make build && make up
```

## Writing

```sh
$ hugo new posts/2020-12-24-i-got-a-new-idea.md
```

## License

Copyright &copy; 2008 - 2020 [Changkun Ou](https://changkun.de) | CC-BY-ND-NC 4.0