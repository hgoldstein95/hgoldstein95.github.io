# The published CV is generated from resume/resume.tex rather than committed,
# so the site has to be built through here (or with the same steps in CI) to
# pick up an up-to-date static/resume.pdf.

ZOLA ?= zola
LATEXMK ?= latexmk

.PHONY: all build serve check resume clean

all: build

build: static/resume.pdf
	$(ZOLA) build

serve: static/resume.pdf
	$(ZOLA) serve

check: static/resume.pdf
	$(ZOLA) check

resume: static/resume.pdf

static/resume.pdf: resume/resume.tex
	$(LATEXMK) -cd -pdf -interaction=nonstopmode -halt-on-error $<
	cp resume/resume.pdf $@

clean:
	$(LATEXMK) -cd -C resume/resume.tex
	rm -rf public static/resume.pdf
