---
layout: post
title: Advent of Code 2022 in OCaml
categories: languages
---

I always try to use [Advent of Code](https://adventofcode.com/) as an excuse to learn or re-learn a
programming language. Using a language for 25 days (even if it's just for toy problems about elves,
elephants, and monkeys) is a shockingly good way to get comfortable with the language's idioms.

This year I decided to work in OCaml. I've been spending a lot of time lately interviewing
[Jane Street](https://www.janestreet.com/) developers for my research (check out my
[paper](papers/hatra22.pdf) from HATRA'22 if you want to know more), and I thought it would be good
to refresh my memory of how it feels to write OCaml. Technically I did already know OCaml---I taught
it to myself in college---but it's been over 5 years and I had never worked with Jane Street's
[Core](https://opensource.janestreet.com/core/) standard library replacement, so there was plenty
to learn.

My experience with AoC this year led me to two blog post ideas. This post is the first: I'll discuss
my impressions of OCaml and Core and give my honest thoughts on their benefits and drawbacks. Then,
in the next few weeks, I'll write another post on my use of Z3 to solve some of the AoC problems.
But for now, what did I think of OCaml and Core?

My high level take is this: OCaml is a powerful language, and, combined with Core as a standard
library, it gives you the tools to solve problems with the elegance of the best functional
languages, without sacrificing practicality. I'll talk about my positive experience using OCaml's
imperative features and the module system, as well as my praise of Jane Street's tools like the Core
library, `ppx_jane`, and expect tests.

But, in my opinion, OCaml's flexibility is also a problem for usability. The fluid movement between
imperative and functional code means it is hard for library authors to signal when their APIs are
impure; also, the module system provides as many bad ways to organize code as good ones. Libraries,
including but not limited to Core, try to address these problems by establishing (competing)
conventions, but these conventions are not enforced and chronically under-documented.

Overall, I was really happy I chose OCaml to do Advent of Code, and I plan to keep using OCaml in
the future. The limitations I discuss are largely fixable by better documentation and examples, but
they also point to larger language-design questions that go far beyond OCaml and its ecosystem.

## What I liked!

### Imperative Features

Functional programmers are sometimes dogmatic about functional code being "better" than imperative
code, but dogma almost never the right way to make engineering decisions. I won't get into the
benefits and drawbacks of functional vs. imperative programming in this post; instead, I'll just
give an example of why, on occasion, I opted to use OCaml's imperative features to augment my
primarily-functional programming style.

The specific example I have in mind was day 16 of AoC, which required measuring the shortest paths
between all nodes on a graph. I remembered that the Floyd-Warshall algorithm would compute the
required distances, but I didn't quite remember how to implement it, so I turned to
[Wikipedia](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm). The pseudo-code from
that article looks like this:
```
let dist be a |V| × |V| array of minimum distances initialized to ∞ (infinity)
for each edge (u, v) do
    dist[u][v] ← w(u, v)  // The weight of the edge (u, v)
for each vertex v do
    dist[v][v] ← 0
for k from 1 to |V|
    for i from 1 to |V|
        for j from 1 to |V|
            if dist[i][j] > dist[i][k] + dist[k][j]
                dist[i][j] ← dist[i][k] + dist[k][j]
            end if
```
The details are not important, but note that the whole algorithm is very imperative; it computes the
all-pairs distances by continually updating a distance matrix.

My first instinct was to try to adapt this algorithm to a functional style---honestly that probably
wouldn't be too difficult---but I ran the risk of accidentally introducing a bug in my adaptation.
This was a small part of a larger problem, and I wanted my implementation of Floyd-Warshall to be
bulletproof so I could focus on fixing bugs in the rest of the code. So I just replicated the
Wikipedia pseudo-code more or less line for line:
```ocaml
let floyd_warshall edges nodes =
  let dist : int Hashtbl.M(StringPair).t = Hashtbl.create (module KeyPair) in

  List.iter edges ~f:(fun (node, successors) ->
      List.iter successors ~f:(fun successor ->
          Hashtbl.set dist ~key:(node, successor) ~data:1));

  List.iter nodes ~f:(fun node ->
      Hashtbl.set dist ~key:(node, node) ~data:0);

  List.iter nodes ~f:(fun k ->
      List.iter nodes ~f:(fun i ->
          List.iter nodes ~f:(fun j ->
              let dist_ik = Hashtbl.find dist (i, k) in
              let dist_kj = Hashtbl.find dist (k, j) in
              let dist_ij = Hashtbl.find dist (i, j) in
              match (dist_ik, dist_kj, dist_ij) with
              | Some dist_ik, Some dist_kj, Some dist_ij
                when dist_ij > dist_ik + dist_kj ->
                  Hashtbl.set dist ~key:(i, j)
                    ~data:(dist_ik + dist_kj)
              | Some dist_ik, Some dist_kj, None ->
                  (* dist_ij = ∞ *)
                  Hashtbl.set dist ~key:(i, j)
                    ~data:(dist_ik + dist_kj)
              | _ -> ())));
  dist
```
It's a bit more verbose because I wanted things to be type-safe, but this is more or less exactly
the same as above, and it worked like a charm.

Of course, I'm not claiming that this would have been impossible in other functional languages, but
it felt very natural in OCaml. It was really nice to be able to just sit down, copy the code from
Wikipedia, and have it work without needing to think about the details of the algorithm or figure
out how to fit the stateful code into a pure program. I found this to be a refreshing benefit of
OCaml, given that I usually do my work in Haskell.

### Module System

### Core

#### General Organization

#### `ppx_jane`

#### Expect Tests

## What I didn't like as much.

### Imperative Issues

### Module Complexity

### Competing Conventions