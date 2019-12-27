---
layout: post
title: Combinatorial Testing for Algebraic Data Types
categories: misc
---
I'm excited to announce that I'll be at POPL 2020, presenting a poster on *Combinatorial Testing for
Algebraic Data Types*. For technical details, check out my [abstract](), or the [poster](), this
blog post is going to be higher-level and presents a more casual, intuitive understanding.

## Combinatorial Testing
Let's say you want to test an application, but the app can be configured with a series of *input
parameters*. For example, the app might behave differently in admin mode
(`admin = true`/`admin = false`) or with a different backend database (`db = postgres`/`db =
mysql`). Ideally, we'd like to be sure that in any combination of these parameters, the system still
works as expected -- this is known as a *combinatorial testing* problem.

Unfortunately, if there are 5 input parameters, each of which has two values, you'd need to run
$2^5 = 32$ tests to test everything. With 20 parameters you'd have to run over a million tests. If
there were around 250, you'd have as many tests as there are atoms in the observable universe.
Clearly, we need to try something different.
