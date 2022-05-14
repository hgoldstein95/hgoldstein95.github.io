---
layout: post
title: Monadic and Applicative Generators
categories: pbt
---

> This post is about property-based testing (PBT), and I'll assume you know Haskell and are
> familiar with [QuickCheck](https://hackage.haskell.org/package/QuickCheck). If you need a
> refresher on PBT, I recommend this short [YouTube video](https://youtu.be/qmA9qhaECcE) that I made,
> and if you want an even deeper dive there's John Hughes's [How to Specify
> It!](https://link.springer.com/chapter/10.1007/978-3-030-47147-7_4).

## A Tale of Two Generators

A lot of my work in property-based testing (PBT) deals with _generators_. In QuickCheck, a generator
has type `Gen a`, and you can call
```Haskell
generate :: Gen a -> IO a
```
to "run" a generator and sample random values of type `a`. Generators are built using a variety of
different primitive operations, but in this blog post I'll use two:
```Haskell
choose :: (Int, Int) -> Gen Int
oneof :: [Gen a] -> Gen a
```
The `choose` combinator randomly picks an integer in a given range, and the `oneof` combinator
randomly picks from a list of generators to run.

Since `Gen` is a monad, we can use monad operations to combine primitive generators into complex and
interesting ones. For example, this is a classic generator for binary search trees (BSTs):
```Haskell
data Tree = Leaf | Node Tree Int Tree

genBST :: (Int, Int) -> Gen Tree
genBST (lo, hi) | lo > hi = return Leaf
genBST (lo, hi) =
  oneof [
    return Leaf,
    do
      x <- choose (lo, hi)
      l <- genBST (lo, x - 1)
      r <- genBST (x + 1, hi)
      return (Node l x r)
  ]
```
The monadic nature of `Gen` is really important for a generator like this: the generators for `l`
and `r` need to depend on the result of generating `x`. The generator uses a monadic bind (via
do-notation) to maintain the BST invariant that all values in the left subtree are less than `x` and
all the ones on the right are greater than `x`.

Of course, all monads are applciatives too. This means that instead of building a generator with
`return` and bind (`>>=`), we can build them with the less powerful `pure` and zap (`<*>`) instead.
Here's the types to refresh your memory:
```Haskell
class Applicative f where
  pure :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b

class Applicative m => Monad m where
  return :: a -> m a
  return = pure
  (>>=) :: m a -> (a -> m b) -> m b
```

The trade-off is that applicative generator's can't represent data structures like BSTs in the same
way. We can write an applicative generator for height-bounded trees:
```Haskell
genTree :: Int -> Gen Tree
genTree 0 = pure Leaf
genTree n =
  oneof [
    pure Leaf,
    Node <$> genTree (n // 2)
         <*> choose (-10, 10)
         <*> genTree (n // 2)
  ]
```
But there's no way to express dependencies between a node's value and its children, as we'd need to
generate BSTs.

The problem lies in the fact that applicative generators can only compose in parallel, not in
series. The arguments to the zap operator can't depend on one another. In contrast, a monadic
generator composes in series---the second argument to bind depends on the value produced by the
first. Only the series composition is sufficient for producing constrained structures like binary
search trees.


## The Complication

This is a classic story that's been told before. This series-versus-parallel framing isn't unique to
generators, and it's a common way people talk about monadic and applicative structures in general.
But in the case of generators, there's something unsatisfying about this story. What about this
generator?
```Haskell
genBST' :: Gen Tree
genBST' = foldr insert Leaf <$> genList
```
Frustratingly, this generator is applicative[^1], but it generates BSTs! Rather than construct a
valid BST from the top down, this generator simply generates a list of integers and then inserts
them one after the other into a tree. As long as `insert` is written correctly, this generator
always produces a valid BST---no monads needed!

For a while, this irked me. Non-structural generators like this seem to be the best of both worlds,
using minimal power for maximal expressiveness, but it sort of seems like they're _cheating_.
Indeed, there are at least a few ways that `genBST'` is unsatisfying:
1. It relies on the correctness of `insert`, which may very well be a function that we intended to
   test. 
2. There is little hope of "tuning" this kind of generator (e.g., changing the shapes of trees that
   it produces).
3. This same strategy doesn't apply to other related monads. You couldn't make a parser for binary
   search trees that parsed a list first and then inserted the values! That wouldn't make any sense.
  
Luckily, I think I found a fairly satifying answer.


## Making Generators "Play Fair"

To recap, our question is this: what is the difference between `genTree` and `genBST'` that makes
`genTree` feel like it's "playing fair" and `genBST'` feel like it's "cheating"? I propose that the
answer is this: the functions passed to zap in `genTree` are _bijections_ whereas the ones in
`genBST'` are not.

Looking at the generators, this is certainly true: in `genTree` the only functions that we use are
constructors, which simply package up values, whereas in `genBST'` we call `foldr insert Leaf` which
can map multiple lists to the same binary search tree. But why would that make the difference?

First, if the functions we use in our generators need to be bijections, then there isn't much room
for complicated functions like `foldr insert Leaf` that turn something unstructured like a list into
something more structured like a tree. This would tend to rule out library functions that might
themselves be incorrect. But admittedly, this is a hand-wavey argument.

My strongest argument addresses point 2 above. The reason `genBST'` is so hard to tune is that
_tuning genList doesn't help you tune genBST'_! Even if you wrote `genList` to give a wonderfully
uniform and varied distribution of lists, there is no reason to think that `genBST'` will have a
useful distribution of trees. Not only does the structure change significantly, but the fact that
`foldr insert Leaf` is non-injective means that we would need to tune `genList` with the
understanding that multiple lists might be mapped to the same tree. A generator like `genTree` does
not have this problem---we can tune it directly by changing the weights with which it makes its
choices.

Finally, the bijection condition does also help with relationships to other monads, but I haven't
explored that in detail yet.


## Coda: FEATs of Generation

TODO Talk about FEAT and motivation

---
[^1]: Actually, it only requires that `Gen` be a `Functor`, but that distinction is less interesting
    for the sake of this discussion.
