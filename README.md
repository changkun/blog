# Changkun's Blog

_https://blog.changkun.de_

The source code.

## Build

```sh
$ go install github.com/gohugoio/hugo@latest
```

```sh
$ make
$ make s   # local server
$ make bin # require Go 1.16
$ make dev # require Go 1.16
```

## Writing

```sh
$ hugo new posts/2020-12-24-i-got-a-new-idea.md
```

Update header before posting:

```diff
-id:
-slug: /posts/todo
-draft: true
+id: 200
+slug: /posts/i-got-a-new-idea
```

## License

Copyright &copy; 2008 - 2020 [Changkun Ou](https://changkun.de) | CC-BY-ND-NC 4.0