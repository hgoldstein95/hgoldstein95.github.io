# CLAUDE.md

Maintenance notes for Harrison Goldstein's personal site — [harrisongoldste.in](https://harrisongoldste.in).
Static site, [Zola](https://www.getzola.org/), deployed by GitHub Actions on push to `master`.

## Commands

```
make serve    # zola serve on :1111, live reload
make          # full build into public/
make check    # zola check — validates internal and external links
```

Use `make`, not `zola build`. The published CV at `static/resume.pdf` is generated from
`resume/resume.tex` and is **not** in git, so a bare `zola build` ships a site whose CV link 404s.
The Makefile rebuilds the PDF whenever the `.tex` is newer.

`make check` currently reports two pre-existing broken links in old blog posts (a dead podcast URL,
a StackOverflow anchor). They are content problems, not build problems. Note that `zola check` only
walks markdown — links that live in `data/*.toml` are invisible to it, so the same dead podcast URL
also sits unchecked in `data/talks.toml`.

## Zola 0.23 runs Tera 2 — read this before touching a template

Tera 2 is not Tera 1, and most Zola documentation and examples online are still Tera 1. What is gone:

| Tera 1 | Use instead |
|---|---|
| `{% macro %}` / `{% import %}` | `{% include %}` a partial; the included file sees the current context, including loop variables |
| `\| filter(attribute="x", value=true)` | list comprehension: `[p for p in pubs.papers if p.selected]` |
| `\| slice(end=3)` | subscript slicing: `blog.pages[0:3]` |
| `\| concat(with=x)` | nothing — there is no list append. Precompute the list in a data file |
| `+` on arrays | also unsupported; `+` is numbers only |

`group_by`, `length`, `default`, `date`, `markdown`, `striptags`, `trim`, `truncate`, `safe`, and
`reverse` all still work. `group_by` returns an **unsorted** map, so never rely on its key order —
`data/publications.toml` carries an explicit `venues` array for exactly this reason.

Tera 2 also has "components" (`{% component %}`), a typed replacement for macros. This site does not
use them; partials in `templates/partials/` cover everything so far.

## Layout

`templates/base.html` is a CSS grid shell, `1fr 336px`, max-width 1160px:

```
grid-template-areas:  "head rail"      desktop
                      "main rail"

grid-template-areas:  "head"           ≤ 900px
                      "rail"
                      "main"
```

The rail restacking **between** the header and the main content on narrow screens is deliberate:
email and news land above the fold on a phone. `.shell::after` paints the rail's panel stripe at full
page height behind the sticky rail.

Order inside the header is always **bar → directory → lede**. Do not reintroduce CSS `order` to
rearrange it; the directory sits directly under the button that opens it so nothing below moves when
the mobile menu expands.

Breakpoints: **900px** (columns collapse) and **640px** (mobile bar, directory becomes the menu,
rows stack). There are no others.

## Design system

Tokens live in `sass/_tokens.scss`; everything else is `sass/style.scss`. Colors are CSS custom
properties (`--ink`, `--paper`, `--panel`, `--hair`, `--border`, `--mute`, `--body`, `--accent`,
`--wash`). Type is Archivo 400/500/600 from Google Fonts.

House rules, taken from the design this was built to:

- **No rounded corners, no shadows, no gradients, no monospace in the UI, no icons.** Arrows (`→`,
  `↗`) are Unicode and are the only decoration.
- Hierarchy comes from **weight and rules**, never from shrinking text. Nothing is below 12.5px.
  Section headings are 16px/600 — the same size as body copy — sitting on a 1px ink rule.
- `font-variant-numeric: tabular-nums` on every date, year, and count.
- **Interactive elements must not change size between states.** Chips are weight 500 in every state
  (switching weights reflows the row); the menu button's icon sits in a fixed 18×12 slot; the tile
  hover arrow holds its 12px of space and only fades. This was an explicit request — check it when
  adding any new control.

Reusable pieces: `.section` + `.section-head` (heading plus optional `All 14 →` link), `.rows` +
`.row` (52px year / flexible middle / right meta, or `.row--two` for 1fr auto), `.cards` (three
across, 1px gaps showing through as rules), `.prose` (blog posts and markdown pages).

## Animation

GSAP 3.13, **self-hosted** at `static/js/gsap.min.js` and loaded `defer` — a CDN copy was silently
blocked by shield-style content blockers, which turned every animation off with no error.

`window.siteMotion()` (defined in `base.html`) returns the GSAP object, or `null` when GSAP is
missing or `prefers-reduced-motion: reduce` is set. **Every caller must treat `null` as "just set the
final state."** All animation is progressive enhancement; the site is fully functional without it.

Currently animated: press feedback (tiles scale to 0.985, chips nudge 1px), the mobile menu's
staggered open, and rows fading in when the venue filter changes. There is deliberately **no
page-load entrance animation** — one existed and was removed by preference. Do not add it back.

## No-JS invariants

Two things depend on JavaScript to *hide* rather than to show, so the page degrades correctly:

- The directory ships **open**; the script closes it on load. Without JS, mobile visitors keep the
  navigation.
- The venue filter chip row ships with `hidden`; the script reveals it. Without JS, every paper shows
  and there is no dead UI.

Keep that polarity for anything new.

## Content

All structured content is TOML in `data/`, loaded with `load_data`.

- **`publications.toml`** — one flat `[[papers]]` list. Keep it in **year-descending order**; nothing
  sorts it at render time. Each paper needs `year`, `title`, `authors`, `venue`, `venue_short`,
  `topic`, `major`; optional `awards`, `kind`, `venue_date`, and `selected = true` to put it on the
  home page. PDF links must be **root-relative** (`/papers/foo.pdf`) — a bare `papers/foo.pdf`
  breaks on `/publications/`.

  **`major = true`** marks refereed conference and journal papers. `/publications/` renders those in
  the main list and everything else — workshops, experience reports, demos, posters, essays — under
  "Workshops, Demos & Other". Every paper sets the flag explicitly (`true` or `false`) so an entry
  that forgets it stands out. The venue filter covers **only** the major list, so the top-level
  `venues` array holds only the `venue_short` values used by major papers; adding a major paper at a
  new venue means adding that venue to the array too, which also fixes the chip order. Non-major
  venues (`PLATEAU`, `HATRA`, `OCaml`, `SCF`, `SysML`, `DBTest`, `Draft`, …) are deliberately absent
  from it. `topic` and `kind` are currently carried in the data but read by no template.
- **`news.toml`** — `short` ("Aug 25") for the rail's date column, `date` for the long form, `text`
  in markdown.
- **`directory.toml`** — the "I'm looking for…" destinations: `label`, `url`, optional `hint`. Order
  here is order on the page. Adding an entry with no matching page will fail `make check`.
- **`rail.toml`** — recruiting line, email block copy, "Also here" links, closing note. Top-level
  scalars must stay above the `[email]` table and `[[links]]` array or TOML reads them as part of it.
- **`talks.toml`** — one flat `[[items]]` list: `title`, `venue`, optional `with` and `[[items.links]]`.
  Add `selected = true` to put a talk on the home page. Like `rail.toml`, that scalar must sit
  **above** the `[[items.links]]` sub-table or TOML reads it as part of the link. Order here is order
  on the page; nothing sorts it. Every talk, selected or not, is listed under "Talks & Appearances"
  on `/publications/`.
- **`students.toml`**, **`dissertation.toml`** — self-explanatory.

Home page prose is the body of `content/_index.md`.

**Everything on the home page below the lede is opt-in**, and all three sections work the same way:
papers with `selected = true` in `publications.toml`, talks with `selected = true` in `talks.toml`,
and posts with `featured = true` under `[extra]` in their front matter. Nothing is capped, so the
count is yours to choose — but the blog `.cards` grid is three across, so featured posts look best in
multiples of three. Each section's `All N →` link goes to the full list; for talks that is the
`#talks` anchor on `/publications/`.

Several files still carry **`TODO(harrison)`** markers — the rail's email etiquette copy, the
recruiting line, and the `/group/`, `/courses/`, `/projects/`, `/press/` stubs. Those are waiting on
Harrison's words; do not invent policy, bios, or course listings to fill them.

## Adding a blog post

`content/blog/my-post.md`:

```toml
+++
title = "Post Title"
date = 2026-04-17
+++
```

Add `aliases = ["/old/path.html"]` when replacing a legacy URL. Add `featured = true` under `[extra]`
to put the post on the home page — a new post does **not** appear there on its own. Code blocks are highlighted with
class-based markup against `public/giallo.css`, which Zola generates and `base.html` links **before**
`style.css` so the prose rules still own the `<pre>` container.

### Math

Set `math = true` under `[extra]` to load MathJax on that post. Markdown runs first and will mangle
unprotected LaTeX (`$a^*b^*$` becomes `a^<em>b^</em>`), so:

- **Display math** goes in a raw HTML block, passed through verbatim:
  ```
  <div class="math">
  $$
  D_a(r^*) = D_a(r)r^*
  $$
  </div>
  ```
- **Inline math** uses single dollars with `*` and `_` backslash-escaped: `$a^\*b^\*$`. A literal
  LaTeX backslash pair is written `\\\\`.

## Layout of the repo

```
config.toml              base URL, author, footer. No nav — that lives in data/directory.toml
data/                    structured content, loaded by templates
content/                 markdown; _index.md is the home lede, blog/ the posts
templates/
  base.html              shell, masthead, rail include, menu toggle, siteMotion
  index.html             home
  publications.html      full list + venue filter
  group.html             stub prose + real student list
  blog-list.html, blog-page.html, page.html, redirect.html
  partials/
    rail.html            email, news, "Also here"
    directory.html       the "I'm looking for…" nav / mobile menu
    paper-row.html       shared by index.html and publications.html; expects `paper`
    talk-row.html        shared by index.html and publications.html; expects `item`
sass/
  _tokens.scss           colors, layout vars
  style.scss             everything else
static/                  copied verbatim: img/, papers/, slides/, js/gsap.min.js, CNAME
resume/                  resume.tex → static/resume.pdf at build time
```

## Deploy

Push to `master`. `.github/workflows/deploy.yml` compiles the CV in the `texlive/texlive` image,
installs Zola from its release tarball (pinned by version **and** sha256 — update both together),
builds, and deploys `public/` via the Actions-based Pages flow. GitHub Pages must be set to **GitHub
Actions** as its source. Work on a branch; nothing ships until it merges.
