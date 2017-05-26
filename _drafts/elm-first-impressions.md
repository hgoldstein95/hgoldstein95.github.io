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
and renders a view. Then, it listens for messages from the view, passes each
one to the `update` function, changes the model accordingly, and re-renders only
the parts of the view that changed.

I really like this approach because it manages abstraction in a really
intelligent way. On one hand, I have access to (and am expected to deal with)
all of the application-specific parts of my project. As a programmer, I need to
specify the application state, how that state changes, and what that state
"looks like". On the other hand, machinery that is especially general (the
wiring) is taken out of the programmer's control completely. (There isn't a lot
of configuration in Elm; in general, if the run-time want's to handle something,
you're expected to let it.)

A nice side effect of this is that Elm is actually really fast. In some sense,
the Architecture encompasses all of the slowest parts of the application---this
makes it free to heavily optimize those pieces.

### Static Typing
The other **major** benefit of Elm is that it is statically typed. This means
that the compiler (and not the Chrome developer console) catches your mistakes.
I could go on for a long time about the benefits of a good type system, but I'll
leave that for another blog post.

## Cons
### No Type Classes
Since Elm looks so much like Haskell, I often expect it to behave like Haskell.
While it does most of the time, sometimes it falls short. One large place this
happens is with type classes. Elm has no type classes, and so it misses out on
some of the really nice features that come along with them. For example, rather
than use `do` notation to deal with monads, we need to explicitly call the
`bind` (in Elm, usually called `andThen`) function associated with whatever
monad we'd like to use. (This problem comes down to type classes because
Haskell's `do` is tied to the `Monad` type class; anything that implements
`Monad` gets `do` for free.)

Things like `do` notation would be a nice to have, but in the end, it isn't such
a big deal. One thing that is a big deal is how Elm deals with comparisons. In
Haskell, we have `Eq a` and `Ord a`, which allow a user to define comparisons
for their own types. Elm uses something called `comparable`, which seems to be a
sort of restricted polymorphic type variable. Basically, a function
{% highlight haskell %}
f : a -> Int
{% endhighlight %}
can take any argument at all, but a function
{% highlight haskell %}
g : comparable -> Int
{% endhighlight %}
can only take an argument that permits comparisons. Unfortunately, the only
types that are `comparable` are `Int`, `Float`, `Time`, `Char`, `String`---and
that's it. There's no way to make a user defined type comparable, since
`comparable` is just a built-in language construct and not a formal type class.
This is especially frustrating since the built in type `Dict` (a dictionary
based on a balanced binary tree) has the following interface:

{% highlight haskell %}
get : comparable -> Dict comparable v -> Maybe v
{% endhighlight %}

The result is that no user defined types can ever be the key of a dictionary,
even if there is a perfectly reasonable way to compare them.

---
<br>

Overall, I really like Elm. It's been fun to work with, and it's definitely
mature enough to be usable for some projects. It definitely has some drawbacks,
and I'd hesitate to put it into production just yet, but it's definitely heading
in the right direction.
