---
layout: post
title: Basic Recursive Function Theory
categories: projects
---

## The Language
The language of BRFT is based on an untyped lambda calculus. There aren't any
real surprises at the language level---we have lambda abstraction and
application, natural numbers with some primitive operations, and $$fix$$. The
big-step semantics for the language looks something like this:

$$ \begin{aligned}
n &\Downarrow n \qquad && \text{for all natural numbers}\ n\\
\lambda x. b &\Downarrow \lambda x. b \\
succ(a) &\Downarrow v \qquad && \text{iff}\ a \Downarrow n\ \text{and}\ v = n +
1 \\
pred(a) &\Downarrow v \qquad && \text{iff}\ a \Downarrow n\ \text{and}\ v = n -
1 \\
zero(a; b; c) &\Downarrow v \qquad && \text{iff}\ a \Downarrow 0\ \text{and}\ b
\Downarrow v \\
zero(a; b; c) &\Downarrow v \qquad && \text{iff}\ \neg (a \Downarrow 0)\
\text{and}\ c \Downarrow v \\
a(c) &\Downarrow v \qquad && \text{iff}\ a \Downarrow \lambda x. b\ \text{and}\
b[c/x] \Downarrow v \\
fix(f) &\Downarrow v \qquad && \text{iff}\ f(fix(f)) \Downarrow v \\
a; b &\Downarrow v \qquad && \text{iff}\ a \downarrow\ \text{and}\ b \Downarrow
v
\end{aligned} $$

The only slightly unusual thing is the sequencing operator, $$a; b$$. This
operator starts by running $$a$$. If $$a$$ ever halts, expressed by the
predicate $$a \downarrow$$, it evaluates $$b$$ and keeps the result.

There is also a typing relation on terms in the language, which the paper
largely elides. The only rule mentioned explicitly is the one for $$fix$$, shown
here:

$$ \frac{f \in \overline{T} \to \overline{T}}{fix(f) \in \overline{T}} $$

## The Halting Problem
In the language of BRFT, a claim that the halting problem is unsolvable can be
stated as follows: there is no function $$h \in \overline{\textbf{N}} \to
\textbf{2}$$ such that for any term $$t \in \overline{\textbf{N}}$$, $$h(t)
\Downarrow 1$$ iff $$t$$ halts. It turns out that this fact can actually be
proven using BRFT itself.
