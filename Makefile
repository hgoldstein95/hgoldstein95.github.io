# static/resume.pdf is generated from resume/resume.tex rather than committed,
# so a bare `zola build` ships a site whose CV link 404s.

ZOLA ?= zola
LATEXMK ?= latexmk

.PHONY: all build serve check resume clean

all: build

build: static/resume.pdf
	$(ZOLA) build

# zola does not watch data/, so edits there do nothing without this.
serve: static/resume.pdf
	$(ZOLA) serve --extra-watch-path data

check: static/resume.pdf
	$(ZOLA) check

resume: static/resume.pdf

static/resume.pdf: resume/resume.tex
	$(LATEXMK) -cd -pdf -interaction=nonstopmode -halt-on-error $<
	cp resume/resume.pdf $@

clean:
	$(LATEXMK) -cd -C resume/resume.tex
	rm -rf public static/resume.pdf
