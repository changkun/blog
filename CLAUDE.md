# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The content of Changkun's bilingual (English/Chinese) blog at https://changkun.de/blog: long-form posts and short "ideas", in markdown. This repository holds content only. The website (`changkun/website`, package `internal/blog`) renders it from a checkout on the server; a push to main runs `.github/workflows/blog.yml`, which pulls that checkout.

See README.md for the layout of `content/`, the front matter, the shortcodes (`en`, `zh`, `augmented`, `lastupdate`) and how to preview with the website.

## Conventions

- Posts: `content/posts/YYYY-MM-DD-name.md`, or a folder of that name with `index.md` and its files. `slug` must start with `/posts/`.
- Ideas: `content/ideas/YYYY-MM-DD-name.md`, with `slug`, `title` and `title_zh`. The website's ideas API writes them.
- Addresses must not change: give a moved page an `aliases` entry with its old address.
- `content/_todo/` is not published.

## License

CC-BY-NC-ND 4.0
