---
layout: post
title: The Classical Monad
categories: languages
---

### The Philosophical Divide
The nature of constructive logic leads to a number of different philosophical
interpretations. Many argue that constructive logic is the "right" way to do
logic; they argue that the only real way to believe something is to be shown
evidence, and constructive logic embodies that mentality. Others argue that
classical logic makes more sense. Those people say that $$P \vee \neg P$$ is
obviously true, and that proof by contradiction is a very natural way to think
about math.

### The Classical Monad
We'll call our classical monad `C`. First and foremost, we know it
should turn a normal constructive proposition into one that is somehow
*labelled* as classical; since propositions are isomorphic to types, we can
express $$\mathcal{C}$$ as a function at the type level. Next, we want
$$\mathcal{C}$$ to be a valid monad. It should have operations $$\eta$$ and a
$$\mu$$ or `return` and `join`/`bind`.

The final property that we want is for the monad to somehow express the
condition that $$P \vee \neg P$$ might have been used to construct the enclosed
proposition. (Note that we could construct $$\mathcal{C} (A \implies A)$$)
