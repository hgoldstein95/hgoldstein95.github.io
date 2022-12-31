---
layout: post
title: Advent of Code 2022 in OCaml
categories: languages
---

**TODO**

OCaml is a powerful language, and, combined with Jane Street's Core as a standard library, it gives
you the tools to solve problems with the elegance of the best functional languages, without
sacrificing practicality. I'll talk about my positive experience using OCaml's imperative features
and the module system, as well as my praise of Jane Street's tools like the Core library,
`ppx_jane`, and expect tests.

But, in my opinion, OCaml's flexibility is also a problem for usability. The fluid movement between
imperative and functional code means it is hard for library authors to signal when their APIs are
impure; also, the module system provides as many bad ways to organize code as good ones. Libraries,
including but not limited to Core, try to address these problems by establishing (competing)
conventions, but these conventions are not enforced and chronically under-documented.

Overall, I was really happy I chose OCaml to do Advent of Code, and I plan to keep using OCaml in
the future. The limitations I discuss are largely fixable by better documentation and examples, but
they also point to larger language-design questions that go far beyond OCaml and its ecosystem.

# What I liked!
**TODO**
- Pros
  - Usefulness of imperative features (especially state)
  - Modules are a nice way of organizing code; I really like the `M.t` idiom now
  - Base and Core are nicely designed and intuitive to use
  - I was surprised by how well the `ppx_jane` pre-processors replaced type classes
  - `expect_test`

# What I didn't like as much.
**TODO**
- Cons
  - I still really wanted some way to explicitly mark that a function mutated its input
  - Documentation is embarrassingly lacking
  - In general, I think OCaml relies entirely too much on conventions for usability---you can get
    derailed really really quickly if someone decides to go a different way
  - `dune` and `opam` are great if everything is set up just so; not as great if you want to do
    something different