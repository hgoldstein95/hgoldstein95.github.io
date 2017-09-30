---
layout: post
title: Derivatives of Regular Expressions
categories: languages
---

> Quick disclaimer: The ideas in this blog post are not my original work. I am
> paraphrasing from lectures given by both Nate Foster and Dexter Kozen at
> Cornell University, and adding some of my own intuition and insights where I
> think it is helpful. My intent is to increase awareness of a cool thing that I
> am excited about, not to pass any of this work off as my own.

Regular expressions come up a lot in computer science. From a theory
perspective, they are a compact and intuitive way to understand regular
languages. In practice, they allow programmers to recognize phone numbers,
search for files, and even parse HTML.[^1] Up until about a month ago, I
thought I knew everything I wanted to know about regular expressions, and then I
discovered Brzozowski derivatives.

Before I start, let's take a step back and define exactly what we mean by
regular expressions. Here's a nice inductive definition:

$$ r ::= \varnothing \mid a \mid r_1 + r_2 \mid r_1 r_2 \mid r^* \quad\quad a
\in \Sigma $$

Note that this definition is minimal---I don't include things like $$r^+$$ or
$$r?$$ because they can be written in terms of the other operators. One bit
of notation that I *will* use is $$\varepsilon \iff \varnothing^*$$, the regular
expression denoting the empty string.

At this point, I'll assume you have a general understanding of how to interpret
regular expressions; so if I write $$a^*b^* + c$$, you should know that it
denotes any string that is either zero or more $$a$$'s followed zero or more
$$b$$'s, or just $$c$$.

### The Brzozowski Derivative
With notation out of the way, we can start to look at what a Brzozowski
derivative is.[^2] Intuitively, it is a way of partially interpreting a regular
expression. The derivative of $$r$$ with respect to a character $$a$$,
$$D_a(r)$$, is a new regular expression that matches all strings from $$r$$ that
started with an $$a$$, but without the $$a$$. We "take $$a$$ off the front of
$$r$$". For example,

$$ D_b(foo + bar + baz) = ar + az $$

Since $$foo$$ doesn't start with a $$b$$, we dropped that part of the expression
altogether. For each of the other pieces, we just took a $$b$$ off of the front.

Now that we understand what we're going for, let's actually define a way to
compute $$D_a(r)$$. We'll do it inductively, step by step.

$$ D_a(\varnothing) = \varnothing $$

This one should be pretty obvious. If you take $$a$$ off of every string in
$$\varnothing$$... well there were no strings to begin with.

$$ D_a(c) = \begin{cases}
\varnothing & a \neq c \\
\varepsilon & a = c
\end{cases} $$

The idea here is that if you try to take $$a$$ off of the string $$a$$, you get
an empty string back, and if you try to take $$a$$ off of the string $$c$$
(where $$c$$ is some character that isn't $$a$$), you just can't do it.

$$ D_a(r_1 + r_2) = D_a(r_1) + D_a(r_2) $$

If you want to take an $$a$$ off the front of an alternation, you can either
take it off of the first expression, or off of the second.

$$ D_a(r_1r_2) = D_a(r_1)r_2 + E(r_1)D_a(r_2) $$

Uh oh. What does $$E(r)$$ mean? It's actually totally straightforward, and I'll
define it in detail soon. For now, just know that $$E(r) = \varepsilon$$ if
$$r$$ can denote the empty string, and $$\varnothing$$ otherwise. With that in
mind, this statement says that taking $$a$$ off of a concatenation either means
taking $$a$$ off of the first expression, or **if the first expression can be
empty** taking $$a$$ off of the second expression.

$$ D_a(r^*) = D_a(r)r^* $$

Finally, we can say that taking an $$a$$ off of a sequence of $$r$$'s means
taking $$a$$ off of the first $$r$$, and leaving a sequence of $$r$$'s after
that. This looks a little silly, but if you play around with it for a bit, it
should make sense.[^3]

### Making Observations
Let's go back and define $$E(r)$$, which we'll call the observation function.
Remember that it "observes" whether $$r$$ can denote the empty string, and
returns $$\varepsilon$$ or $$\varnothing$$ accordingly. Here's the definition:

$$ \begin{aligned}
E(\varnothing) &= \varnothing \\
E(a) &= \varnothing \\
E(r_1 + r_2) &= E(r_1) + E(r_2) \\
E(r_1r_2) &= E(r_1)E(r_2) \\
E(r^*) &= \varepsilon
\end{aligned} $$

The only tricky thing here is convincing yourself that the $$+$$ and $$\cdot$$
cases work. These facts might help:[^4]

$$ \begin{aligned}
\varnothing + r &= r \\
r + \varnothing &= r \\
\varnothing r &= \varnothing \\
r \varnothing &= \varnothing \\
\varepsilon r &= r \\
r \varepsilon &= r
\end{aligned} $$

It turns out that $$E$$ will be more important than just helping us define the
derivative. We can actually use the observation function to tell us about which
strings match a given expression.

### Matching Strings
We're finally ready to implement a regular expression matcher. Let's can extend
our derivative function from earlier to handle entire strings:

$$ \begin{aligned}
\hat{D}_{\varepsilon}(r) &= r \\
\hat{D}_{ax}(r) &= \hat{D}_x(D_a(r))
\end{aligned} $$

I now claim that $$r$$ matches a string $$x$$ if and only if

$$ E(\hat{D}_x(r)) = \varepsilon $$

So how does this work? Well, $$\hat{D}_x(r)$$ goes character-by-character in
$$x$$, taking each character off of $$r$$, in turn. This means that by the end,
we will have a regular expression that matches everything left in $$r$$ after
taking the string $$x$$ off the front.

If we take $$x$$ off of the strings in $$r$$ and that set contains the empty
string, then it must be the case that $$x$$ was in $$r$$ to start with!
Conversely, if we know that $$r$$ matched $$x$$ to start with, then removing
$$x$$ from $$x$$ would leave us with $$\varepsilon$$.

Practically, this means that we can use Brzozowski derivatives to write regular
expression matchers in code! I have a
[Haskell implementation](https://gist.github.com/hgoldstein95/0fe2def7591b44391521d988f28abf03)
as a gist on GitHub that you can check out, and I am also currently writing a
verified version in Coq.

### Why I'm Excited
When I first learned about regular expressions formally, we were given a process
for implementing them:
0. Transform the regular expression into an $$\varepsilon$$-NFA, using a
   Thompson construction.
0. Turn that $$\varepsilon$$-NFA into a normal NFA.
0. Determinize the NFA to get a DFA.
0. Run the DFA on the input string.

There are things that I love about this algorithm too. It relies on the amazing
result that regular expressions, NFA's, and DFA's are all the same, and the
Thompson construction itself is really brilliant. But there's just something
that feels so nice and PL-ey about the derivative approach. Rather than deal
with intermediate representations and stateful algorithms, we can just define
our desired result by induction, and write pure functions that capture our
intent. The Brzozowski derivatives are also totally *symbolic*. The whole
process is just replacing symbols with other symbols, which obviates the need
for any complex reasoning.

Ultimately, this algorithm captures the reason that I study programming
languages. For me, doing computer science isn't about just solving the
problem.[^5] It's about seeing the structure of the problem that you are working
with, and letting that structure guide you to an answer. It's about avoiding
complex decision procedures in favor of symbolic manipulations that simplify and
transform your goal. At the end of the day, Brzozowski derivatives are just a
different way of looking at regular expressions---but I think they're a really
freaking cool way of looking at regular expressions, so I wrote a blog post.

<br>
<br>

-----
<br>

Notes:

[^1]: For those of you who don't get the joke, this
    [stack overflow answer](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454)
    is a must read.

[^2]: Technically, this is the Brzozowski *Syntactic* Derivative. There is also
    a Semantic Derivative that deals with DFA's and their denotations.

[^3]: If you squint at these last two definitions, admittedly pretty hard, you
    might see something familiar. The structure of the concatenation and star
    rules sort of mimics the product and power rules for derivatives in
    calculus. I doubt this is just a coincidence, and if I ever find a satisfying
    reason why this is, I'll probably write another post about it.

[^4]: I'm being sort of sloppy with my notation. What I really mean is that
    $$[\![\varnothing + r ]\!] = [\![ r ]\!]$$, etc., so $$E(r)$$ might not
    actually be equal to $$\varepsilon$$ or $$\varnothing$$, but it will always
    be denotationally equal to one or the other.

[^5]: To be clear, there's nothing wrong with "just solving the problem"---in
    fact, that's usually a far more effective approach.
