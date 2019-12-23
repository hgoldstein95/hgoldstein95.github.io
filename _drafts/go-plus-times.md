---
layout: post
title: The Problem with Error Handling in Go
categories: languages
---

At it's core, the problem is that an error-producing function in Go returns it's output *and*
an error, rather than returning it's output *or* an error.

### Sums and Products
In programming languages theory, there are two patterns of types that form the basis of the
so-called *algebraic data types*. **Product types** which encompass things like *pairs*, *tuples*,
and even *structs*, express some type `T` *and* another type `U`. For example, the type
```java
class StringWithNum {
  String x;
  int y;
}
```
is a product of the types `String` and `int`.

**Sum types**, on the other hand, represent a type `T` *or* a different type `U`. These are slightly
less common, but you will almost definitely have seen them in the form of optional types like Java's
`Optional<T>`, Haskell's `Maybe t`, or Rust's `Option<T>`. All of these structures represent a value
*or* nothing, which we represent as the sum of `T` and "unit". If we want a fully general sum type,
the previously mentioned languages have `Either<A, B>`, `Either a b`, and `Result<T, E>`
respectively.

Algebraic data types like sums and products are usually talked about in the context of functional
programming languges, where they are the main means of data abstraction, but they really are
everywhere. Virtually every typed language has some form of a product type, and more and more
languages are including types like `Optional` and `Either`.

### Returning Errors
Assuming that the type you want to return isn't a pointer, the standard way to return a `T` in a
function that might fail is to return `(x T, err error)`. It's pretty easy to see that this is a
*product* type! It specifies that you'll obtain two values -- one is a `T`, and the other is an
`error`. But that doesn't seem right... if a function returns an error, there shouldn't
be a `T`, and if it doesn't fail then there shouldn't be an `error`.

Go's solution is Sir Tony Hoare's "billion-dollar mistake", **null**.[^1] If your funciton succeeds,
you simply stick `nil` in the slot where the `error` goes. If it fails, you can happily return
`nil` along with your `error`.

In my opinion, this appoach has two significant problems:
1. Your type is lying to you! It says that you have two things, but in reality only one of them
   should be there at any given time.
2. In order to make up for the lying type, we had to use `nil`!

I think the latter problem is actually the bigger issue. In the decades since null values were first
introduced, it has become clear that they pose a problem. Since almost any value can be null, null
values infect a system like a virus. Often, the presence of null values causes code to break
unexpectedly, and when it doesn't it is often because programmers have littered their algorithms
with paranoid checks that data is present.

The unfortunate part is that in this case, the choice of how to handle errors has forced the
language implementer's hand. It's possible to choose to have null in a system with whatever kind of
error handling you want, but it's not possible to choose to *avoid* null once you've chosen a
product type for returning errors.

### Other Options
If returning a product is the wrong approach, what's the right one? Well as I mentioned above, more
and more languages are starting to incorporate sum types like `Optional` and `Either`. With a sum
type, we can get closer to how we actually think about the code -- functions can return a value *or*
an error, not both!

Even though I'm not the biggest fan, another reasonable approach is exceptions. Languages like C++
and Java allow functions to produce errors that are totally separate from the their return type,
which are handled by a totally separate language mechanism. This isn't quite as explicit as using
sum types, but at least exceptions don't require that the language has null values.

### Conclusion


---

[^1]: See [this wikipedia
    article](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions) for context.
