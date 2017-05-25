---
layout: post
title: Elm, First Impressions
categories: languages
---

> I like exploring new programming languages and paradigms in my spare time.
> Here are some of my thoughts on Elm.

Elm is a purely functional, strongly typed language for web development. It's a
very opinionated language, with a very powerful run-time that is designed to make
writing web applications easy. There are some things that I really like about
Elm, and some things that I find frustrating.

## Pros
### The Elm Architecture
All Elm applications are written with the same general design pattern. The
general structure is similar to things like Redux and Flux (which was actually
designed with Elm in mind):
- `model`: A single object, encapsulating the entire state of the application.
- `update`: A pure function that takes a messsage and a model and produces a new
  model.
- `view`: A pure function that takes a model and produces instructions on how to
  render the application.

This pattern is called "The Elm Architecture", and the run-time supports it
directly. Once you specify these three components, the run-time sets up a model
and renders a view. Then, it listens for messages from the view and passes each
one to the `update` function, changes the model accordingly, and re-renders only
the parts of the view that changed.

### Static Typing

## Cons
### Missing Functional Features

### Limited Use-Cases
