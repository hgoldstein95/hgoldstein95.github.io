---
layout: post
title: The (Regular) Language of Dance
categories: languages
---

Over the last few weeks, I've gotten really into swing dancing. It's a new and
exciting challenge for me---I'm not the most coordinated person, and dancing is
a unique kind of social interaction. For the most part, this has taken me well
out of my comfort zone. Luckily, as is often the case with learning new things,
I've found ways to relate these new ideas to things I already know. In
particular, I realized that if you reeeally squint, swing dancing looks kind of
like a regular language.

### Crash Course in Swing Dancing

The dance that I've been learning is usually called
[East Coast Swing](https://en.wikipedia.org/wiki/East_Coast_Swing). It's a
really fun social dance that is usually danced to quick swing music. The basic
East Coast Swing step is a six-count pattern---depending on the tempo of the
music, the pattern is either "rock step, triple step, triple step" or "rock
step, step, step". At my level of dance, that's basically all there is to the
footwork.

Of course, there's a lot more to dancing than footwork. In swing, partners dance
done in a number of different holds and positions. There are also tons of
different moves that make the dance fun and interesting. I highly recommend
checking out some YouTube videos of people dancing to get an idea of what I
mean.

### A Dancing Machine

When I started learning different swing moves, I realized that each move was
sort of a "transition" from one "state" to another. For example, the partners
might be dancing in closed position and the lead might use a "tuck-turn" to
transition to open position. More subtly, a left-side pass might leave the
couple in open position, but with the leader's hand on top of the follow's hand
(normal open position has the leader's hands under the follow's).

As a computer scientist, when I hear "states" and "transitions" I immediately
think of
[finite automata](https://en.wikipedia.org/wiki/Deterministic_finite_automaton).
Finite automata are often written out as graphs like the ones below. The nodes
are states, and the edges represent transitions. Essentially, when a node *p*
has an edge labelled *a* to another node *q*, you're allowed to "do *a*" to
transition from *p* to *q*. Here is an automata that I built based on the first
few moves that I learned when I started doing swing.

**DIAGRAM**

As you can see, it gets pretty complicated pretty quickly, but focusing in on a
particular state often helps to clear things up. For example, just looking at
"closed", we see that a basic step would keep the couple in closed position, and
a tuck-turn would transition to open position.

### Speaking My Language

It should be clear that if we focus in on only the moves and positions, we could
(mostly) represent East Coast Swing routines using a finite automaton. At any
given point in the dance, all of the "valid" moves would be available as
transitions, and other ones wouldn't. It is a well known fact in computer
science that every finite automaton corresponds to a *language*---formally some
set of sequences of symbols (strings) that satisfies some property. In this
case, the "symbols" are swing moves, and the property is that the whole sequence
makes sense as a dance. This means that we literally have a "languge" of swing
dance, and it corresponds exactly to routines.

Taking this a step further, we can examine exactly which kinds of strings are in
the language of East Coast Swing. According to my "beginner" automaton above,
the string

> basic, basic, tuck-turn, left-side pass, right-side pass

is a valid dance, but

> right-side pass, basic

is not (since you can't do a right-side pass from closed position) and neither
is

> tuck-turn, left-side-pass, left-side pass

because the lead's hand would get all flipped around.
