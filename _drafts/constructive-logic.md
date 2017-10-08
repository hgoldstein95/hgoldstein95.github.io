---
layout: post
title: The Constructive Logic and the Classical Monad
categories: languages
---

### Crash Course in Constructive Logic
For those of you who've never seen constructive logic, here's a quick
introduction.

Consider standard, first-order logic, with propositions like $$P$$ and $$Q$$,
compound statements

$$ P \vee Q \quad\quad P \wedge Q \quad\quad P \Rightarrow Q \quad\quad \neg P
$$

and quantified statements

$$ \forall (x : D). P(x) \quad\quad \exists (x : D). P(x) $$

Classically, we have a truth-functional semantics for logical statements. This
means that each of the logical connectives has a truth table that completely
defines its behavior.

Constructive logic takes a different approach. When a statement is true in
constructive logic, there is *evidence* that it is true. A proof of $$P \wedge
Q$$, for example, is a pair of proofs: one for $$P$$ and one for $$Q$$. This
seems like it would be morally the same as classical logic, but there is one
major exception: proof of $$P \vee Q$$ requires either proof of $$P$$,
**labelled** as "left", or proof of $$Q$$, **labelled** as "right".

This has the (unfortunate?) effect that there is no way to prove the statement
$$P \vee \neg P$$ for an arbitrary statement $$P$$---you'd need to know whether
to use "left" or "right", and you can't. It turns out that all statements in
classical logic which are not provable constructivley could be proved if $$P
\vee \neg P$$ was added as an axiom; we will come back to this fact later.

### The Curry-Howard Correspondence
Constructive logic is often done in the context of constructive type theory.
There is a 1-1 correspondence between propositions in constructive logic and
standard types:

---

$$ P \wedge Q \longleftrightarrow P * Q $$

Conjunction correspods to a product type, or a pair. Values of this type look
like `(p, q)`.

---

$$ P \vee Q \longleftrightarrow P + Q $$

Disjunction corresponds to a sum (or tagged union) type. Like we saw above,
values of this type are either `left p` or `right q`.

---

$$ P \Rightarrow Q \longleftrightarrow P \to Q $$

Implication translates to a function type. We'll use ML syntax and write a
function `fun p -> q`.

---

$$ \neg P \longleftrightarrow P \to \bot $$

Negation is also a function, but the codomain is *bottom* (also called **False**
or **Void**). Since $$\bot$$ is uninhabited, a function from $$P$$ to $$\bot$$
is equivalent to saying that $$P$$ cannot be inhabited.

---

$$ \forall (x : D). P(x) \longleftrightarrow \Pi(x : D). P(x) $$

Universal quantification corresponds to a $$\Pi$$-type, or a dependent function.
Values of this type are also functions, but their types depend on values. (These
types don't come up much in conventional programming languages, but they are a
staple of proof assistants like Coq, Agda, Nuprl, etc.)

---

$$ \exists (x : D). P(x) \longleftrightarrow \Sigma(x : D). P(x) $$

Existential quantification corresponds to a $$\Sigma$$-type, or a dependent
pair. A value of this type is a pair, but the type of the second element can
depend on the first element. Often this manifests as a pair of a value and proof
of some property of that value.

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
