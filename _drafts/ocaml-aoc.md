---
layout: post
title: Advent of Code 2022 in OCaml
categories: languages
---

I always try to use [Advent of Code](https://adventofcode.com/) as an excuse to learn or re-learn a
programming language. Using a language for 25 days (even if it's just for toy problems about elves,
elephants, and monkeys) is a shockingly good way to get comfortable with the language's idioms.

This year I decided to work in OCaml (code on [GitHub](https://github.com/hgoldstein95/aoc2022)).
I've been spending a lot of time lately interviewing developers at
[Jane Street](https://www.janestreet.com/) for my research (check out my
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

## Imperative Features

Functional programmers are sometimes dogmatic about functional code being "better" than imperative
code, but dogma almost never the right way to make engineering decisions. I won't get into the
benefits and drawbacks of functional vs. imperative programming in this post; instead, I'll just
give some examples of why, on occasion, I opted to use OCaml's imperative features to augment my
primarily-functional programming style.

### Replicating Pseudo-code

My first example is day 16 of AoC, which required measuring the shortest paths between all nodes on
a graph. I remembered that the Floyd-Warshall algorithm would compute the required distances, but I
didn't quite remember how to implement it, so I turned to
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
  let dist = Hashtbl.create (module Tuple.Hashable_t(String)(String)) in

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

This would all have been possible in other functional languages, but maybe not easy. By contrast, it
felt very natural in OCaml. It was really nice to be able to just sit down, copy the code from
Wikipedia, and have it work without needing to think about the details of the algorithm or figure
out how to fit the stateful code into a pure program.

### Saving Intermediate Results

Later on in the code for day 16, there is another great reason to have imperative features easily
within reach. I had written an algorithm for part 1 that was not quite correct for part 2. I could
have re-architected the code, but I realized that if I simply saved some intermediate state from the
part 1 algorithm in a hash table, I could analyze those intermediate steps to get the part 2
solution. You can take a look at
[the code](https://github.com/hgoldstein95/aoc2022/blob/main/day16/Day16.ml#L136) to see the
specifics. This, again, would have been possible to do functionally, but the imperative version fit
better with my intuition about the code and got me to a part 2 solution much more quickly.

### Keeping Track of Mutation

While I found OCaml's imperative features quite useful, I kept coming back to one feature that I
desperately wanted: mutability markers.

As a refresher, here's how mutability works in OCaml. Most values are immutable by default; `int`s,
`string`s, `float`s, `list`s, etc. are all immutable and cannot be reassigned. There are a just few
examples of values are are mutable:

- References. A value of type `'a ref` is a mutable reference holding a value of type `'a`. These
  can be reassigned by anyone who has access to the reference.
- Arrays. A value of type `'a array` is essentially a collection of references to `'a`s.
- Mutable fields. A record of type `{ mutable foo : 'a }` has a field named `foo` that can be
  reassigned.

These types can be used to build bigger, more complex kinds of mutable data, like Core's
`Hashtbl.t`.

The problem with this setup is that mutable values can be mutated through immutable values. A record
of type `{ foo : 'a ref }` can still be mutated, even though `foo` is not marked mutable, since
`'a ref` is mutable. Worse, a record of type `{ foo : bar }` is also mutable if `bar` contains a
mutable type anywhere inside of it. One could argue that this is why languages like Haskell
quarantine mutation in a monad, but it seems like there must be a lighter-weight solution.

In particular, I'd love to know if mutability annotations like those in Rust, Swift, and Ada could
be adapted to work in OCaml. It would be so nice to be able to write a signature like:
```ocaml
val create : unit -> 'a Hash_set.t mut
val add : 'a Hash_set.t mut -> 'a -> unit
```
The signature for `create` signals that the resulting value can be mutated, and the signature for
`add` requires that the provided hash set is marked mutable. Importantly, this API would allow
someone to mark a particular hash set as *immutable*, something that is currently not possible. I
would have liked something like this in the Floyd-Warshall algorithm above, which uses mutation to
build a hash table, but then returns a hash table which should really be immutable.

If anyone has pointers on information about (1) what is particularly hard about mutability
annotations in ML, and/or (2) if anyone has thought about implementing them, I'd love to know about
it.

## Modules and Core

Throughout my work on AoC, I made heavy use of Jane Street's
[Core](https://opensource.janestreet.com/core/) library. The library aims to replace OCaml's
standard library with a larger variety of built-in functionality and more consistent APIs.

I tried to use Core in the most idiomatic way I could---any time it felt like the library was
pushing me towards a certain style of programming I followed it. This was made more difficult by a
general lack of documentation; the library documentation is scarce at best, rarely giving context
for why things are the way they are, and almost never providing usage examples. I would love to see
that improve, but luckily, the [Real World OCaml](https://dev.realworldocaml.org/) book uses Core
(and its younger sibling Base) extensively, and it is *fantastic*. In fact, it seems like Real World
OCaml is as or more useful than Google for most OCaml questions.

When I managed to get my bearings with the structure and idioms of Core, I was quite pleasantly
surprised. I found that most design decisions either made sense to me immediately, or seemed strange
until I worked with them for a while and realized that they solved some nasty problem I hadn't
anticipated. For example, the way to declare a hash table with string keys and integer values is:
```ocaml
int Hashtbl.M(String).t
```
This looks fairly ridiculous, especially if your knowledge of functors is rusty; I think most people
would expect:
```ocaml
(int, string) Hashtbl.t
```
But as I got comfortable with `deriving` attributes it became clear that the former approach is a
nice solution to a quirk of the module system. Writing
```ocaml
type t = int Hashtbl.M(String).t [@@deriving compare, equal]
```
works just fine, whereas the other version of the type breaks the preprocessor.

And breaking the preprocessor is a huge issue; Core relies heavily the preprocessor to improve the
ergonomics of things like equality, comparisons, hashing, random generation, and pretty-printing.
Languages like Haskell and Rust use type-classes and traits for these kinds of universal behaviors,
but the preprocessor provides an almost-acceptable alternative. To compare two `t`s, as defined
above, you can write:
```ocaml
[%compare: t] x y
```
It's not quite as nice as Haskell's `Ord` type class, and it's awkward to need macros to get
something approaching ad-hoc polymorphism, but it works in a pinch.

### Standard Library Design is Language Design

Standard library design is often overlooked as an aspect of language design, but it is incredibly
important. The structures and idioms that the standard library uses become the structures an idioms
that libraries use, which then become muscle-memory for the language's users. Unfortunately, OCaml's
standard library impoverished enough that others felt the need to step in and make some of their own
design decisions. The end result is that OCaml+Core feels like a dialect of OCaml---they're mutually
intelligible, but you'd be hard-pressed to "speak" one if you only spent time with the other.

This becomes problematic when working with external libraries, or any code that does not very
carefully follow Core's idioms. For example, working with the `z3` library caused friction because,
I expected there to be a `Z3.Expr.t` (since, in Core, a module `M` always has a type `t` so `M.t` is
always conceptually "an `M`") when instead the type was called `Z3.Expr.expr`.  This is minor, sure,
but it was quite annoying to need to look up documentation for something that could have been
automatic. There are internal inconsistencies too: data structure operations in Core take the
structure as the first argument, and all other parameters are named (e.g.,
`List.map : 'a List.t -> ~f:('a -> 'b) -> 'b List.t`), but for some reason `List.take` breaks that
rule.

In contrast, when a library does follow Core's idioms, life is great. On a whim, while working with
the `angstrom` parser combinator library, I thought I'd see if they used Core's syntax for monads.
To my delight, typing
```ocaml
let open Angstrom.Let_syntax in
let%bind x = m1
let%bind y = m1
return (x, y)
```
worked on the first try! The `crowbar` library also has a monad, but it doesn't use the same module
structure or function names, so I had to take a few minutes to write a `Let_syntax` wrapper myself.