---
layout: post
title: Sitcom Drama and Compilers
categories: languages
---

Let's say we're watching a sitcom. Peter is our lovable, naive protagonist, and
he's dating Mallory. Mallory isn't good for Peter, and always tries to convince
him to do the wrong thing. We don't like Mallory.

## Scene 1
Peter and Mallory have been dating for a few months, and Mallory asks Peter to
share a very personal *memory* with her. Peter isn't sure, so he goes to talk to
his friends Charlie and Rob. As always, Charlie is very trusting. He says

> "Of course you can share that memory with her. You trust her, and so do I!"

Rob, on the other hand, sees a problem. He notices that Mallory could
potentially turn this good *memory* into a bad one for Peter. She might *mutate*
it in Peter's mind, totally ruining it! He recommends that Peter keep the memory
to himself.

> "You're just saying that because you don't like her!"

Peter exclaims. But Rob is calm and holds his ground. He reiterates that sharing
memories can be dangerous, and suggests other ways for the couple to connect.

In the end, Peter appreciates that Rob was looking out for him, and decides to
keep Mallory's access to his memories somewhat restricted.

### *Scene*
In the world of programming, Charlie is played by the C compiler, and Rob is the
compiler for [Rust](https://www.rust-lang.org/en-US/). Rust is an up-and-coming
systems language that leverages *linear types* to guarantee memory-safety
without a garbage collector. Whereas C is happy to let you share references to
memory whenever you want, Rust prevents a whole host of bugs by restricting how
memory can be shared. Specifically, if data is passed to a function that intends
to mutate it, the reference needs to be explicitly marked as mutable. The
following code won't compile, since `x` is never marked as mutable.

{% highlight rust %}
let x = 42;
do_mutation(&x);
{% endhighlight %}

This code works without a problem.

{% highlight rust %}
let mut x = 42;
do_mutation(&mut x);
{% endhighlight %}

There are actually a lot of other cool features in Rust, so if you haven't seen
it, I highly recommend checking it out.

In any case, I prefer to have friends like Rob and the Rust compiler at times
like this. Sure, they don't trust my judgment as easily, but why should they? I
make mistakes all of the time, and I want a friend who watches my back.

## Scene 2
Peter still doesn't realize that Mallory is trouble, and now they've been dating
for a while. Mallory asks Peter if they can move in together, but, again, Peter
isn't sure. This time he talks to his friends Henry and Ike.

Henry is a hopeless romantic, and doesn't really see how bad Mallory is for
Peter. He thinks that there's no harm in them living together. Ike, disagrees!
He says

> "Peter, what if you realize that you don't like Mallory in a few months? Won't
> it be hard for you to break up?"

Ike realizes that, in this case, it's possible that the relationship could never
*terminate*. Furthermore, Ike realizes that this isn't the right *type* of
relationship for Peter, because he understands what Peter *values*.

In this case too, Peter gets upset:

> "Why can't I just see what living together is like? Everyone else says it's
> worth a try!"

But Ike reminds Peter that while it's great for a relationship to last forever,
that situation should never happen by accident. A month later, Peter is happy
that Ike saved him from a nearly impossible breakup.

### *Scene*
Here, Henry is the Haskell compiler, and Ike is
the [Idris](https://www.idris-lang.org/) compiler. Idris is a *dependently
typed* language, which means that it's types can contain actual program values.
(Note that we could also have cast Agda or Coq as Ike, but I really like Idris
because it attempts to be more of a general purpose language.) In this case,
Haskell doesn't mind that you've written a non-terminating program. Also, even
though it is statically typed with a very powerful type system, Haskell types
can't depend on program values.

Idris, on the other hand, has a totality checker, which means that it can tell
if a program will terminate or not. Obviously, a completely correct totality
checker would solve the halting problem, but it turns out that writing a
*mostly* correct totality checker is possible, using the right heuristics. In
the case of Idris, the totality checker decides if a program *might not* halt,
occasionally drawing an overly conservative conclusion. If the programmer is
confident that his or her program does, in fact, halt, he or she can provide a
proof that it does. Also, if a program is supposed to loop forever (i.e. a
server or REPL), it can be marked as `partial`.

In addition to totality checking, Idris has a dependent type system that allows
you to make strong guarantees about your programs. Types can contain values, so
things like "a list of length *n*", or even "a balanced binary tree" can be
expressed in types. Again, I prefer this kind of experience to the alternative.
Of course, there are plenty of times that I end up fighting with the Idris
compiler because it won't let me do something, but often I realize that the
thing that I was trying to do was a mistake anyway. I'd take Ike as a friend
over Henry any day.

## In all seriousness...
As silly as all of this is, I do really believe that a compiler (like a good
friend), should do everything it can to keep you from making avoidable mistakes.
Even the most experienced programmers write bugs, and if the compiler doesn't
catch them, the client will. Personally, I hope that languages with
super-powered type systems like Rust and Idris start to gain footing in
real-world settings. I'll feel much more confident in other people's programs
when I know that they've been consulting with the Robs and Ikes of the world.
