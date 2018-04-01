---
layout: post
title: The (Regular) Language of Dance
categories: languages
---

Over the last month or so, I've gotten really into swing dancing. It's a new and
exciting challenge for me---I'm not the most coordinated person, and dancing is
a unique kind of social interaction. For the most part, this has taken me well
out of my comfort zone. Luckily, as is often the case with learning new things,
I've found ways to relate these new ideas to things I already know. In
particular, I realized that if you reeeally squint, swing dancing looks kind of
like a regular language.

### Crash Course in Swing Dancing

<div style="text-align: center; margin: 20px">
  <img src="../../../../img/swingout.gif" />
</div>

The dance that I've been learning is usually called
[East Coast Swing](https://en.wikipedia.org/wiki/East_Coast_Swing). It's a
really fun social dance that is usually set to quick swing music.

The basic East Coast Swing step is a six-count pattern---depending on the tempo of the music,
the pattern is either "rock step, triple step, triple step" or "rock step, step,
step". Often, dancers will also incorporate elements of *Lindy Hop*, a very
closely related dance, which uses the eight-count pattern "rock step, triple
step, step, step, triple step". The latter can be seen in the gif above.

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
A finite automaton is a mathematical structure that is often written out as a
graph like the ones below. The nodes are states, and the edges represent
transitions. Essentially, when a node *p* has an edge labeled *a* to another
node *q*, you're allowed to "do *a*" to transition from *p* to *q*. Here is an
automata that I built based on the first few moves that I learned when I started
doing swing.[^1]

<div style="text-align: center; margin: 20px">
  <img width="90%" src="../../../../img/dance.svg" />
</div>

As you can see, even with just a few moves and states, the diagram gets pretty
complicated pretty quickly. Focusing in on a particular state often helps to
clear things up; for example, looking at "closed", we see that a basic step
would keep the couple in closed position, and a tuck-turn would transition to
open position.

### Keeping Count

As we increase the complexity of the moves that we allow, there are a number of
interesting things that we can add to the model. Here's a slightly more
complicated automaton that incorporates some 8-count "Lindy Hop" moves.

<div style="text-align: center; margin: 20px">
  <img width="90%" src="../../../../img/dance2.svg" />
</div>

The main thing to notice is that when I added some 8-count Lindy Hop moves, I
added extra states. Strictly speaking, dancing 8-count moves doesn't correspond
to a different *physical* position, but it does correspond to a different
*mental* position. When leading, it is important to be able to tell your partner
that you want to start dancing 8-count patterns when you've been doing 6-count,
or vice versa. Since my partners and I are usually beginners, I try to use a
simple move (like a basic) to go between standard East Coast and Lindy.

### Speaking My Language

It should be clear that if we focus in on only the moves and positions, we can
represent the space of East Coast Swing routines using a finite automaton. At
any given point in the dance, all of the "valid" moves would be available as
transitions, and other ones wouldn't. It is a well known fact in computer
science that every finite automaton corresponds to a (regular)
*language*---formally some set of sequences of symbols (strings) that satisfies
some property. In this case, the "symbols" are swing moves, and the property is
that the whole sequence makes sense as a dance. This means that we literally
have a "language" of swing dance, and it corresponds exactly to routines.

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

When I lead a dance, I can keep a model like this in my head. Obviously, I'm not
actually simulating the automaton in earnest, nor am I really thinking about
strings and languages, but thinking about moves this way gives me a framework
for deciding what to do next. If the "strings" that my partner and I dance are
in the language of swing, I can be sure that the dance will feel natural.

### Next Steps <img height="30px" src="../../../../img/steps.jpg" />

I have a lot of cool ideas for ways to use this language model of dance, and
I'll probably write another post exploring one or more of those options later.
For now, I'll just mention a couple of my ideas.

**Non-determinism.**

The automata above are both (mostly) deterministic. This means that the current
state completely determines the effect of a move. Put more simply, it means that
there are no two arrows with the same label and the same source state.

Technically speaking, labeling both "closed" and "closed, 8-count" as start
states is a form of non-determinism, but this is resolved as soon as the dance
starts, so it isn't very interesting. A more interesting form of non-determinism
is "$$\varepsilon$$-transitions". An $$\varepsilon$$-transition is a transition
that happens without a symbol being read, or, in this case, without a move being
done. It turns out that these transitions don't actually change the set of
languages that automata can represent, but they do offer a compact and intuitive
way to consider state changes that don't depend on the input/moves.

If I allowed myself to use $$\varepsilon$$-transitions, I could encode things
like the music speeding up, or even something as silly as *getting tired*. In
both of these cases, we might want to restrict ourselves to simpler moves that
might be less time-consuming and labor-intensive. In the model, this would
correspond to a set of $$\varepsilon$$-transitions into a copy of the original
machine with the same states but fewer transitions.

**Matching up with music.**

Dancing is rarely done without music, and swing is no exception. A large part of
"getting good" at swing is developing musicality---a sense of how the music
should effect your choice of moves. If we want to express musicality in our
automata model, one place to start might be representing the music as an
automaton as well.

<div style="text-align: center; margin: 20px">
  <img width="60%" src="../../../../img/dance3.svg" />
</div>

This simple automaton counts out the four beats in a measure of swing music.
Let's say we want to enforce that an 8-count move should always start at the
beginning of a measure. This won't always happen, since a 6-count moves often
end mid-measure, but it usually feels better.

One way we could do this would be to simulate both automata simultaneously. Each
time we do a 6-count move, we advance the music automaton 6 steps, and each time
we do a 8-count move, advance it 8 steps. Now, we can make sure that 8-count
moves start at the beginning of a measure by making sure that the music
automaton is in state 1 before we do an 8-count move. I haven't quite worked out
a formal way of doing this yet, but I'm sure there's a clean way to work the
music into the model.

### Conclusion

I am fully aware that I made a ton of simplifications when talking about
dancing. There's a lot more to swing than strings of moves, and even if you do
ignore all of the human and musical aspects, it is still way more complex than I
made it out to be. My point wasn't to fully capture all of swing dance in one
computer science formalism---I just wanted to explore the space and see if I
could learn something.

Dancing is fun[^2], and computer science is fun[^3]. Putting them together is a
natural way for me to explore each in a little bit more depth, and in this case,
I think I got something pretty cool out of it.


<br />
<br />

----
<br />

[^1]: If you are already familiar with automata, you'll notice that I'm ignoring
    accepting states. We could theoretically use accepting states to decide
    which moves are "fun" to end a routine on and which aren't. Here, for the
    sake of simplicity, I'm going to assume that every state is accepting except
    for the implicit "trap" state.

[^2]: For sufficiently musical definitions of fun.

[^3]: For sufficiently nerdy definitions of fun.
