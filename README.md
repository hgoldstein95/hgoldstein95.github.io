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
data/             # Structured homepage content (loaded by templates/index.html)
  news.toml
  publications.toml
  talks.toml
  students.toml
  featured_posts.toml
  coordinates.toml
content/          # Markdown content (TOML front matter, +++ delimiters)
  _index.md       # Homepage prose (about-me paragraphs only)
  about.md
  resume.md
  blog/
    _index.md     # Blog section config (sort_by, page_template)
    *.md          # Blog posts
templates/        # Tera HTML templates
  base.html       # Base layout with nav and footer
  index.html      # Homepage (loads data/ files via load_data)
  blog-list.html  # /blog/ listing page
  blog-page.html  # Individual blog post
  page.html       # Generic page (about, resume)
  redirect.html   # For aliases
sass/             # SCSS source, compiled to static/style.css
static/           # Copied verbatim: images, PDFs, slides, CNAME
```

## Updating Homepage Content

Structured homepage data lives in `data/`. Edit the relevant TOML file:

- **Publications** — `data/publications.toml`: sections with papers, each having `title`, `authors`, `venue`, `links`, and optional `awards`
- **Talks** — `data/talks.toml`: items with `title`, `venue`, and `links`
- **Students** — `data/students.toml`: `[[current]]` and `[[past]]` arrays
- **News** — `data/news.toml`: items with `date` and `text` (supports markdown)
- **Featured posts** — `data/featured_posts.toml`: manually curated list with `title`, `url`, `date`
- **Coordinates** — `data/coordinates.toml`: contact rows with `label`, `url`, `display`, `note`

The about-me prose lives in `content/_index.md` (body only, no front matter changes needed).

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
