# Changkun's Blog

_https://changkun.de/blog_

The posts, ideas and pages of the blog, in markdown. The website,
[changkun/website](https://github.com/changkun/website), renders them: its
server keeps a checkout of this repository, and every push to main pulls
that checkout, which the blog then shows within seconds.

## Writing

- Posts live in `content/posts/`, as `YYYY-MM-DD-name.md`, or as a folder of
  that name with an `index.md` and the post's figures and other files beside
  it. A post's address is its `slug`, such as `/posts/name`.
- Ideas live in `content/ideas/`, at `/ideas/<slug>/`.
- Other pages, such as `about`, are folders of `content/` with an `index.md`.
- Files elsewhere in `content/`, such as `images/`, are served as they are.
- `content/_todo/` holds notes that are not published.

Front matter is YAML between `---` lines: `title`, `title_zh`, `date`,
`lastmod`, `slug`, `tags`, `aliases`, `toc`, `scripts` and `draft`.

Text in `{{% en %}}…{{% /en %}}` and `{{% zh %}}…{{% /zh %}}` shows in one
language at a time; ideas keep the generated part in
`{{% augmented %}}…{{% /augmented %}}`. `{{< lastupdate >}}` writes the
page's `lastmod`. `<!--more-->` ends a post's summary, and `$…$` and
`$$…$$` are math.

Keep each file under 25 MB.

## Preview

Run the website with a folder whose `blog` points at this checkout:

```sh
mkdir -p /tmp/www && ln -s "$PWD" /tmp/www/blog
cd ../website && WWW_DIR=/tmp/www WEBSITE_ADDR=localhost:8080 go run .
```

and open http://localhost:8080/blog/. Changes show on reload.

## License

Copyright &copy; 2008 - 2026 [Changkun Ou](https://changkun.de) | CC-BY-ND-NC 4.0
