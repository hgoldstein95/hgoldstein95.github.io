# hgoldstein95.github.io

Personal website and blog at [harrisongoldste.in](https://harrisongoldste.in), built with [Zola](https://www.getzola.org/).

## Prerequisites

Install Zola: `brew install zola`

## Development

```
zola serve
```

Starts a local server at `http://127.0.0.1:1111` with live reload.

## Build

```
zola build
```

Outputs to `public/`. Sass is compiled automatically (`compile_sass = true` in `config.toml`).

## Deploy

The site is hosted on GitHub Pages and published via GitHub Actions (`.github/workflows/deploy.yml`). Pushing to `master` triggers a build and deploy automatically — no manual steps needed.

The workflow installs Zola, runs `zola build`, and deploys `public/` using the Actions-based Pages deployment. GitHub Pages must be configured to use **GitHub Actions** as the source (Settings → Pages → Source).

## Structure

```
config.toml       # Site config: base URL, nav links, author info
content/          # Markdown content (TOML front matter, +++ delimiters)
  _index.md       # Homepage (uses template = "index.html")
  about.md
  resume.md
  blog/
    _index.md     # Blog section config (sort_by, page_template)
    *.md          # Blog posts
templates/        # Tera HTML templates
  base.html       # Base layout with nav and footer
  index.html      # Homepage
  blog-list.html  # /blog/ listing page
  blog-page.html  # Individual blog post
  page.html       # Generic page (about, resume)
  redirect.html   # For aliases
sass/             # SCSS source, compiled to static/style.css
static/           # Copied verbatim: images, PDFs, slides, CNAME
```

## Adding a Blog Post

Create `content/blog/my-post.md` with front matter:

```toml
+++
title = "Post Title"
date = 2026-04-17
+++

Post content here.
```

Add `aliases = ["/old/path.html"]` if redirecting from a legacy URL.
