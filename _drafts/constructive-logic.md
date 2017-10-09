---
layout: post
title: Intro to Constructive Logic
categories: languages
---

I had originally planned for this explanation to be part of a future post, but
it started to get pretty long, so I thought I'd just post it on its own.

### Interpreting Logic
You've probably seen first-order logic before. A sentence in first-order logic
might look like

$$ \forall x. \exists y. P(x) \wedge \neg Q(x, y) $$

We have some predicates, $$P$$ and $$Q$$, some domain that we're able to
quantify over, and logical connectives like $$\wedge$$ and $$\neg$$ (also
$$\vee$$ and $$\Rightarrow$$). Constructive logic is just a particular
interpretation of these sentences---a way of understanding when they are and
aren't true.

The interpretation that you're probably used to is called classical logic.
Classical logic has a "truth-functional" semantics for logical statements. This
means that every sentence can be viewed as a function from the truth values of
its inputs to the truth values of its outputs. Concretely, this means that every
logical connective has a *truth table* which completely defines how it behaves.

$$ \begin{array}{c|c|c}
P & Q & P \vee Q \\
\hline
0 & 0 & 0 \\
1 & 0 & 1 \\
0 & 1 & 1 \\
1 & 1 & 1
\end{array} $$

Constructive logic takes a different approach. We say that a statement in
constructive logic is true if there is *evidence* that it is true. A proof of
$$P \wedge Q$$, for example, is represented as a pair of proofs: one for $$P$$
and one for $$Q$$. This seems like it would be morally the same as classical
logic, but there are a couple of important exceptions. We will see those
shortly.

### The Curry-Howard Correspondence
Since constructive logic is all about evidence, it is extremely useful to have a
*language* for that evidence. For this, most constructive logicians use
constructive type theory and the typed (dependent) lambda calculus.

By the Curry-Howard correspondence, there is a 1-1 mapping between propositions
in constructive logic and types. This means that we can use a *program* of type
$$A$$ as evidence for the proposition that corresponds to $$A$$. Here are some
common mappings between types and logical operators:

---

$$ P \wedge Q \longleftrightarrow P * Q $$

Conjunction correspods to a product type, or a pair. Values of this type look
like `(p, q)`.

---

$$ P \vee Q \longleftrightarrow P + Q $$

Disjunction corresponds to a sum (or tagged union) type. The values of this type
are either `left p` or `right q`. You might have seen this as an `Either` type
in Haskell.

---

$$ P \Rightarrow Q \longleftrightarrow P \to Q $$

Implication translates to a function type. We'll use ML syntax and write a
function `fun p -> q`.

---

$$ \neg P \longleftrightarrow P \to \bot $$

Negation is also a function, but the codomain is *bottom* (also called `False`
or `Void`). Since $$\bot$$ is uninhabited, a function from $$P$$ to $$\bot$$
is equivalent to saying that $$P$$ cannot be inhabited.

---

$$ \forall x : D. P(x) \longleftrightarrow \Pi(x : D). P(x) $$

Universal quantification corresponds to a $$\Pi$$-type, or a dependent product.
Values of this type are also functions, but their types can depend on values.
(These types don't come up much in conventional programming languages, but they
are a staple of proof assistants like Coq, Agda, Nuprl, etc.)

---

$$ \exists x : D. P(x) \longleftrightarrow \Sigma(x : D). P(x) $$

Existential quantification corresponds to a $$\Sigma$$-type, or a dependent sum.
A value of this type is a pair, but the type of the second element can depend on
the first element. Often this manifests as a pair of a value and proof of some
property of that value.

### Understanding Evidence
Now that we have a logic and a language for evidence, we can start looking at
the differences between constructive and classical logic. Consider the statement

$$ A \Rightarrow A \vee B $$

We can write the corresponding type, `A -> A + B`, and then we can write the
evidence (or "realizer") for that type:

```
fun a -> left a
```

That one was pretty straightforward, but how about this:

$$ P \vee \neg P $$

The corresponding type is `P + (P -> False)`, but when we try to write a
realizer, there's a problem. We know that since the type is `_ + _`, we have to
start with either `left` or `right`... but which one? For an arbitrary $$P$$,
there's no way to know. This is the major difference between classical and
constructive logic. The requirement for evidence means that the statement $$P
\vee \neg P$$ and equivalent statements like $$\neg \neg P \Rightarrow P$$
cannot be proved.

Interestingly, we can prove

$$\neg \neg (P \vee \neg P)$$

```
fun H -> H (right (fun p -> H (left p)))
    : ((P + (P -> False)) -> False) -> False
```

Essentially, this says that constructive logic knows that $$P \vee \neg P$$
can't be false (there would be a contradiction), but it can't give evidence for
the truth of $$P \vee \neg P$$ in every case of $$P$$.

### Who cares?
This was my first reaction to constructive logic.

It seems pretty arbitrary to throw away an intuitive axiom like $$P \vee \neg
P$$. Even worse, things like *proof by contradiction* don't always work when you
disallow the law of excluded middle.

To truly appreciate constructive logic, we require a shift in perspective.
Rather than approach logic as a way of finding *truth* we can instead look at it
as a way of finding *computable truth*. Consider the statement

$$ \forall x : \mathbb{N}. \forall y : \mathbb{N}. (x = y) \vee [(x < y) \vee (y
< x)] $$

A constructive proof of this fact is a computable function. It takes two natural
numbers `x` and `y`, and returns `left peq` if they are equal, `right (left
plt)` if $$x < y$$, and `right (right pgt)` if $$y < x$$. It doesn't just tell
you *that* these three cases exist, it tells you which one is true for any given
inputs. A classical proof of the same fact likely won't carry the same kind of
computational content.
