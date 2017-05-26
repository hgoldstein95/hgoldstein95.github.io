---
layout: post
title: Encryption and Adjunctions
categories: category-theory
---

> For explanations of some of the Category Theory concepts used in this post, I
> highly recommend [this blog](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/).
> The post on [adjunctions](https://bartoszmilewski.com/2016/04/18/adjunctions/)
> is especially relevant.

In Category Theory, a monad is (loosely) defined as a functor $$T$$ with two
natural transformations:

$$ \begin{aligned}
\eta &: Id \to T \\
\mu &: T \circ T \to T
\end{aligned} $$

I wondered what it would look like to replace the $$\mu$$ with a slightly
different natural transformation:

$$ \mu' : T \circ T \to Id $$

My intuition was that this might be useful for some security purposes. If the
functor represented some kind of encryption, then $$\eta$$ allows one party to
encrypt some data, and $$\mu'$$ allows the data to be used after being properly
decrypted.

In practice, however, this didn't quite make sense. The biggest problem was that
encryption and decryption aren't symmetric. It seemed that if this was going to
work, I'd need two functors (call them $$L$$ and $$R$$), and a natural
transformation:

$$ \epsilon : L \circ R \to Id $$

One party can encrypt some data using $$R$$, and the other can apply $$L$$ and
use $$\epsilon$$ to retrieve the data.

If you know some Category Theory, you'll know where this is going: adjunctions!
An adjunction is a pair of functors $$L$$ and $$R$$ with the following natural
transformations:

$$ \begin{aligned}
\mu &: Id \to R \circ L \\
\epsilon &: L \circ R \to Id
\end{aligned} $$

We write $$L \dashv R$$ to express this condition. Note that $$\epsilon$$ is
exactly what we wrote before! If we want to represent encryption as a pair of
functors, it would be smart to choose two *adjoined* functors.


Since we'd like this construct to be useful, we want candidates for $$L$$ and
$$R$$ that are endofunctors in the category of types and pure functions
(sometimes called $$Hask$$, named after Haskell). One such adjunction is

$$ (X, -) \dashv (X \to -) $$

where $$L$$ is the product (or `Tuple`) functor, and $$R$$ is the exponential
(or `Reader`) functor. Using actual code (I'm
using [Idris](https://www.idris-lang.org/)) here), the functors are written as
follows:

{% highlight haskell %}
data L k a = MkL k a
data R k a = MkR (k -> a)
{% endhighlight %}

We can convince ourselves that these functors are adjoined by implementing
$$\mu$$ and $$\epsilon$$, which are polymorphic functions that are
conventionally called `unit` and `counit` respectively:

{% highlight haskell %}
unit : a -> R k (L k a)
unit x = MkR (\y => MkL y x)

counit : L k (R k a) -> a
counit (MkL y (MkR f)) = f y
{% endhighlight %}

But what does any of this have to do with encryption? To answer that question,
we really need to figure out better names for `L` and `R`. Let's start with `R`.
The key insight here is that `R` sort of *hides* data behind a function call. It
takes a value of type `a`, and requires that we have a value of type `k` if we
want our value back. Let's rename `R` to `Encrypted`, and write a function
`encrypt` as follows:

{% highlight haskell %}
data Encrypted k a = MkEncrypted (k -> a)

encrypt : (k : Type) -> a -> Encrypted k a
encrypt _ x = MkEncrypted $ \_ => x
{% endhighlight %}

This function is the reason that I opted to use a dependently typed language
like Idris over Haskell. In order to get any use out of this function, we need
to be able to specify what type `k` actually is; that requires passing a type to
encrypt as if it were data.

Now that we have the `Encrypted` functor, we can make a guess at what `L` is
supposed to be. The name I settled on was `Decrypter`; this is because the key
contained within the tuple can be used to decrypt some encrypted value.

{% highlight haskell %}
data Decrypter k a = MkDecrypter k a
{% endhighlight %}

If we rewrite `counit` from before, we can finally get:

{% highlight haskell %}
decrypt : Decrypter k (Encrypted k a) -> a
decrypt (MkDecrypter x (MkEncrypted f)) = f x
{% endhighlight %}

With all of this machinery, we can:
0. Pick a type `k`; in a dependently typed language, this type can be a proof of
   some sort.
0. Call `encrypt k` on some value of type `a` to get an `Encrypted k a`.
0. Use the `MkDecrypter` constructor, along with a valid value of type `k` to
   make a `Decrypter k (Encrypted k a)`.
0. Call `decrypt` to get the original value out.

---
<br>

My main purpose with this exporation was to gain a deeper understanding of how
Category Theory interacts with real-world programming problems. While the end
result is not particularly useful, it does give some interesting insight into
what a *proof-relevant* encryption system would look like.

In addition, I found it extremely interesting how two inverse concepts like
encryption and decryption map nicely onto adjoined functors. While it is easy to
see that adjoined functors are inverses conceptually, it is nice to see how they
model those behaviors in practice.
