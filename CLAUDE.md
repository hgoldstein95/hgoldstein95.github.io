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

`make check` passes clean. Two caveats about what it can and cannot see:

- `zola check` only walks markdown, so links in `data/*.toml` are invisible to it. When a URL in a
  post also appears in a data file — the Disseminate episode is in both `content/blog/disseminate.md`
  and `data/talks.toml` — fix both; the checker will only ever flag the first.
- `config.toml` has a `[link_checker] skip_prefixes` entry for `stackoverflow.com`, which serves a
  403 to non-browser clients. Without it the checker reports a working link as a bad status or a
  missing anchor. Add a host there only when you have confirmed in a browser that the link is fine.

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

On desktop the rail is held at exactly `100vh` (`min-height` **and** `max-height`), so its last
section, `.rail-links`, can take `margin-top: auto` and sit on the bottom edge of the viewport. Both
are reset in the 900px block, where the rail is static and stacks with the rest of the page.

`grid-template-rows` is **explicit at both widths** (`auto 1fr`, and `auto auto 1fr` below 900px) and
must stay that way. The rail spans both desktop rows and is a full viewport tall; with `auto` rows,
grid splits that height evenly across the rows it spans, which inflates the header and leaves a short
page looking vertically centered. Pinning the header to its content sends all the slack to `main`.
`main` then holds `.content-body` — a wrapper around the `content` block that takes the slack with
`flex: 1 0 auto` so `.footer` sits on the bottom edge of a short page while keeping its own 48px
margin on a long one. The mobile "first section" rule targets `.content-body > :first-child`, not
`.content`, because of that wrapper.

Below 900px the rail is hidden on every page but the home page (`body:not(.is-home) .rail`). The home
template is the only one that sets `{% block body_class %}`; the rail is a phone visitor's email and
news block above the fold there, and a long detour on a sub-page.

Order inside the header is always **bar → directory → lede**. Do not reintroduce CSS `order` to
rearrange it; the directory sits directly under the button that opens it so nothing below moves when
the mobile menu expands.

Breakpoints: **900px** (columns collapse) and **640px** (mobile bar, directory becomes the menu,
rows stack). There are no others.

## Design system

Everything in this section is about the **main site**. The SCAUP Lab sub-site at `/scaup/` has its
own design system and deliberately breaks every rule below; see "The SCAUP Lab sub-site".

Tokens live in `sass/_tokens.scss`; everything else is `sass/style.scss`. Colors are CSS custom
properties (`--ink`, `--paper`, `--panel`, `--hair`, `--border`, `--mute`, `--body`, `--accent`,
`--wash`). Type is Archivo 400/500/600 from Google Fonts.

House rules, taken from the design this was built to:

- **No rounded corners, no shadows, no gradients, no monospace in the UI, no icons.** Arrows (`→`,
  `↗`) are Unicode and are the only decoration. To set a block apart, give it a flat fill: **white**
  brings it forward, `--panel` pushes it back, and `--paper` sits between them, so the two read in
  opposite directions. Then pick the edge by what the block *is* — a **closed 1px box** is a control
  (the directory tiles, the menu button), while a **band** with hairlines top and bottom that bleeds
  through the gutters is a surface (`.about` on the home page, the rail below 900px). White inside a
  four-sided border is the directory tile exactly; use it only for something clickable.
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
- **`scaup.toml`** — everything on the SCAUP Lab sub-site except its lede. Read only by
  `templates/scaup/`. See below.
- **`dissertation.toml`** — self-explanatory.

Home page prose is the body of `content/_index.md`.

**Everything on the home page below the lede is opt-in**, and all three sections work the same way:
papers with `selected = true` in `publications.toml`, talks with `selected = true` in `talks.toml`,
and posts with `featured = true` under `[extra]` in their front matter. Nothing is capped, so the
count is yours to choose — but the blog `.cards` grid is three across, so featured posts look best in
multiples of three. Each section's `All N →` link goes to the full list; for talks that is the
`#talks` anchor on `/publications/`.

## The SCAUP Lab sub-site

`/scaup/` is a separate site — its own design, its own type, its own stylesheet — that happens to be
built by the same Zola invocation. It is a plain section whose templates simply never extend
`base.html`, which is the whole trick: Zola shares nothing between templates that do not inherit
from each other.

```
content/scaup/_index.md    section; body is the lede beside the bird
data/scaup.toml            everything else on the page
templates/scaup/base.html  its own <html>, <head>, fonts, header, footer
templates/scaup/index.html the home page
templates/scaup/page.html  any future sub-page (the section sets page_template)
sass/scaup.scss            → public/scaup.css; standalone, does not import _tokens
static/img/scaup.svg       the bird, in the hero and as the band watermark
```

Adding a page is `content/scaup/whatever.md` with a title — `page_template` on the section routes it
to the sub-site shell automatically, so no `template =` in the front matter.

**The main site's house rules do not apply here.** Rounded corners (10px on photos, 12px on cards), a
hover shadow on the Connections cards, and IBM Plex Mono for the small labels are all load-bearing
parts of the imported design. Do not normalize them toward `style.scss`. Colors are `--sc-`-prefixed
custom properties on `:root`; `scaup.css` is only ever loaded on `/scaup/`, so that is safe.

Things about the port worth knowing:

- The design was drawn at desktop width only. Both media queries in `scaup.scss` (860px collapses the
  hero, 560px tightens the gutters and stacks the header) are additions, as is the `clamp()` on the
  wordmark. The bird takes `order: -1` below 860px so the identity is not pushed under the lede.
- A person in `scaup.toml` with no `photo` renders the empty tinted well the card is already sized
  for, which is what the source design does for an unfilled image slot. Adding a photo later never
  reflows the grid. Photos want a 4:5 crop.
- Section headings (`.sc-label`) were tiny uppercase mono in the source design and are now serif at
  26px, matching `.sc-prose h2`. Mono survives only in the small metadata bits — person links, card
  hosts, the footer email, the colophon.
- There is **no nav.** The header is the eyebrow and a single link back to the main site
  (`.sc-back`, from the `[home]` table in `scaup.toml`). The sections still carry `id`s
  (`#people`, `#homes`, `#contact`) so they can be linked from elsewhere.
- The `homes` array in `scaup.toml` backs the section now titled **Connections**; the key kept the
  name it had when the section was "Wider homes".

`/group/` is now a `redirect.html` stub pointing at `/scaup/`, the same pattern `content/resume.md`
uses. The `data/directory.toml` entry ("the research group.") points at `/scaup/`.

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
  blog-list.html, blog-page.html, page.html, redirect.html
  scaup/                 the SCAUP Lab sub-site: its own base.html, no inheritance
  partials/
    rail.html            email, news, "Also here"
    directory.html       the "I'm looking for…" nav / mobile menu
    paper-row.html       shared by index.html and publications.html; expects `paper`
    talk-row.html        shared by index.html and publications.html; expects `item`
sass/
  _tokens.scss           colors, layout vars
  style.scss             everything else
  scaup.scss             the sub-site, standalone → public/scaup.css
static/                  copied verbatim: img/, papers/, slides/, js/gsap.min.js, CNAME
resume/                  resume.tex → static/resume.pdf at build time
```

## Deploy

Push to `master`. `.github/workflows/deploy.yml` compiles the CV in the `texlive/texlive` image,
installs Zola from its release tarball (pinned by version **and** sha256 — update both together),
builds, and deploys `public/` via the Actions-based Pages flow. GitHub Pages must be set to **GitHub
Actions** as its source. Work on a branch; nothing ships until it merges.
