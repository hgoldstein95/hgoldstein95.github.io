# hgoldstein95.github.io

Personal website and blog at [harrisongoldste.in](https://harrisongoldste.in), built with
[Zola](https://www.getzola.org/).

## Prerequisites

- Zola: `brew install zola`
- A LaTeX toolchain with `latexmk` (MacTeX, or `brew install --cask mactex-no-gui`), used to build
  the CV

## Development

```
make serve    # http://127.0.0.1:1111, live reload
make          # build into public/
make check    # validate links
```

Use `make` rather than `zola build` directly — the CV at `static/resume.pdf` is generated from
`resume/resume.tex` and isn't checked into git.

If you'd rather not install TeX Live, the CV also builds in Docker:

```
docker run --rm -v "$PWD:/work" -w /work/resume texlive/texlive:latest \
  latexmk -pdf -halt-on-error -interaction=nonstopmode resume.tex
cp resume/resume.pdf static/resume.pdf
```

## Deploy

Hosted on GitHub Pages. Pushing to `master` builds and deploys automatically via
`.github/workflows/deploy.yml` — no manual steps.

## Maintenance

Content lives in TOML files under `data/` and markdown under `content/`; templates are Tera, styles
are SCSS in `sass/`. See [CLAUDE.md](CLAUDE.md) for how it all fits together — the design rules, the
data formats, and the Tera 2 gotchas worth knowing before editing a template.
