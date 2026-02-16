# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Changkun's personal blog (https://changkun.de/blog) — a bilingual (English/Chinese) static site built with Hugo using a custom "changkun" theme. Content includes long-form blog posts and an "ideas" micro-post section.

## Build Commands

```sh
make        # Clean and build with minification
make s      # Dev server with drafts enabled at localhost:9219
make clean  # Remove generated files (public/, resources/, blog)
```

Requires Hugo extended edition (v0.91.2+): `go install github.com/gohugoio/hugo@latest`

## Content Authoring

**Create a new post:**
```sh
hugo new posts/YYYY-MM-DD-slug.md
```

**Post frontmatter** (YAML): `date`, `title`, `tags`, `slug` (`/posts/<name>`), `id`, `toc`, `draft`

**Bilingual shortcodes** — wrap content in language blocks:
```
{{% en %}}English content{{% /en %}}
{{% zh %}}中文内容{{% /zh %}}
```

Other shortcodes: `{{< augmented >}}` (expandable deep-dive in ideas), `{{< lastupdate >}}`

**Ideas** live in `content/ideas/`. Blog posts live in `content/posts/` (named `YYYY-MM-DD-slug.md`).

## Architecture

- **Hugo config:** `config.toml` — base URL, permalinks (`posts = "/:slug"`), pagination (5/page), Goldmark with unsafe HTML, Disqus comments
- **Custom theme:** `themes/changkun/` — all layouts, partials, static assets, and i18n data
  - `layouts/partials/` — 23 partials for sidebar, header, footer, post metadata, widgets
  - `layouts/shortcodes/` — `en.html`, `zh.html`, `augmented.html`, `lastupdate.html`
  - `layouts/ideas/` — ideas section with client-side search and pagination (10/page)
  - `static/js/` — dark mode (`dark.js`), language switching (`lang.js`), UI bootstrap (`bootstrap.js`)
  - `data/i18n.yaml` — bilingual UI string translations
- **Bilingual system:** Language stored in `localStorage('lang')`, defaults to `en`. CSS toggles visibility via `data-lang` attribute.
- **Dark mode:** Theme stored in `localStorage('theme')`, supports auto/light/dark. Defaults to system preference.
- **Deployment:** GitHub Actions builds Hugo, deploys via rsync to production server

## License

CC-BY-NC-ND 4.0
