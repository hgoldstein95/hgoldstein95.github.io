---
layout: post
title: The Descriptivist Programming Linguist
categories: misc
---

I think Javascript is bad.

... But, at least in academic contexts, I'm going to try to stop saying that.

## Descriptivism vs. Prescriptivism

Linguists tend to divide themselves into two categories: _prescriptivist_ or _descriptivist_.
Prescriptivists define how language _should_ be used; they make rules for what is "correct", and
argue that users of that language should follow those rules. Descriptivists, on the other hand,
examine the way people _actually use_ a language, without passing judgment on whether or not
their usage is correct.

For example, a prescriptive linguist might argue that

> Well then,,,

is incorrect English. Three commas in a row ",,," means nothing in "Standard English", and thus it
is wrong. On the other hand, a descriptivist might notice that when younger people on the internet
say

> Well then,,,

instead of

> Well then...

they mean something slightly different.[^1] The descriptivist asks what the language users are
gaining by bending the so-called rules, whereas the prescriptivist is adamant that the rules
should be followed.

[^1]:
    I don't actually understand the full nuance, but from what I've gathered the ",,," version is
    either more ironic or more dramatic than the standard "..." used to mean trailing off.

What does any of this have to do with programming languages? Maybe nothing, but I think I've
noticed a bit of a prescriptivist streak in myself and other PL people that I'd like to explore a
bit and potentially change. As far as I can tell, most modern linguists are descriptivists and
think that a prescriptivist mindset can be damaging. I'm not nearly qualified to discuss this in
detail, but as far as I understand prescriptivism can be used as a tool to justify discrimination
and elitism. The prescriptivists who make the rules don't do so in an unbiased way, so the rules
they make can further those biases.

I think I've seen echoes of that kind of damage in the PL community. When people say things like
"Javascript is bad," I worry that researchers might ignore the things make the language
successful. Worse, positions like "HTML isn't a programming language," which implicitly prescribe
the rule "programming language" iff "Turing complete," are used to demean others and further
biases in the community.

In the rest of this post, I want to unpack what prescriptivism and descriptivism might look like
in the context of PL and explain why I'm going to try to be a descriptivist researcher moving
forward.

## Translating Concepts

While programming languages research is nominally about languages, there are a lot of differences
between PL and linguistics. Here are some statements that I think amount to PL prescriptivism:

- Language X is bad/useless/dangerous.
- Language feature X is bad/useless/dangerous/considered harmful.
- Doing X always leads to bugs.
- X isn't a real programming language.

First and foremost, I want acknowledge that, broadly speaking, PL prescriptivism isn't as
damaging as linguistic prescriptivism. I still think that prescriptivism can be used to further
biases, but I don't think Dijkstra was a bad person for writing "Go To Statement Considered
Harmful." That said, statements like the ones above are definitely making rules and passing
judgment, so they certainly feel prescriptive. Given that, let me posit a definition:

> **Programming Languages Prescriptivism**: Defining how programs should be written, or making
> sweeping claims about what languages should and should not be.

Next, let's do the same thing with descriptivism:

> **Programming Languages Descriptivism**: Describing how programmers do write programs and what
> languages and features they use, like, and dislike, without passing judgment.

Of course, these are tricky, squishy concepts, and I doubt these definitions are exactly right.
In particular, these definitions are more applicable for PL design researchers than for, say, PL
theory people. I'll talk a bit more about that in the next section. Regardless, I think these
definitions provide a useful baseline for exploring the effects that prescriptivism and
descriptivism might have in a programming languages context.

## Claimed Benefits of Prescriptivism

Probably the biggest argument in favor of PL prescriptivism is _correctness_. Unlike human
language, which is arguably correct as long as some other human can understand it, computer
languages can go wrong in a number of clear and objective ways. This is why "Go To Statement
Considered Harmful" is a perfectly reasonable stance to take---it is natural to conclude that
`goto` statements are bad because they demonstrably lead to code with more bugs.

I don't have a great response to this, but I will point out that using _data_ to demonstrate a
fact is very different from asserting that fact due to a "gut feeling" or "aesthetics". This is
something I think I'm guilty of myself---when I say that I don't like Javascript, I'll often try
to justify it by claiming that "untyped languages have more bugs." I'm sure people have done
concrete research to test that question, but to be totally honest I haven't read any of it (at
least not recently, and not concerning modern untyped languages). My subjective experience as a
programmer tells me that types are helpful, but I'm just one person with one set of opinions.
Ultimately, I still think that objective correctness is a reasonable justification for
prescriptivism, but one must examine that "objectivity" carefully.

Another, much weaker, argument for prescriptivism is that sometimes the "native speakers"
(programmers) are _just wrong_. They _shouldn't_ like the languages they like. I won't give this
much time, because I think it's an inherently elitist attitude, but I suppose the crowd isn't
always as wise as we'd like. All I'll say is that claims that "programmers don't know what's best
for them" are rarely the kinds of objective statements that justify a prescriptive attitude.

Finally, I want to quickly address pure theory. When PL research becomes theoretical enough, it
often becomes unhelpful to connect it directly to a concrete programming language. In those
cases, it might seem that prescriptivism is the only option! I think this is partially true, but
here's a different perspective: theory is similar to language design just "one level" more
abstract. Theoreticians are often designers too, developing logics and theories that will have
actual users---namely, other computer scientists. When doing theory, you can choose to prescribe
exactly how the meta-theory should be manipulated, or you can look at the way people are using
the current mathematics and use that to inform your design. This means we can "lift" the
descriptivism/prescriptivism definitions to theory, and I think the same arguments apply.

## Benefits of Descriptivism

A quick tangent: I first learned about the prescriptivism/descriptivism divide from a series called
"Tom's Language Files" on YouTube. Tom has a great video on
[Descriptivism vs. Prescriptivism](https://www.youtube.com/watch?v=2qT8ZYewYEY&list=PL96C35uN7xGLDEnHuhD7CTZES3KXFnwm0&index=25),
and he also points out throughout the series that he's a descriptivist. But there's one video in the
series where Tom strays from the path and tells people how language _should be_, not just how it
_is_. In a video on
[Gender Neutral Pronouns](https://www.youtube.com/watch?v=46ehrFk-gLk&list=PL96C35uN7xGLDEnHuhD7CTZES3KXFnwm0&index=23),
Tom says that singular "they" is a better approach than using gendered pronouns like "he" to refer
to a person of unknown gender.[^3] Now, I happen to agree with that stance, but even if I hadn't
the fact that Tom is a consistent descriptivist made his uncharacteristic prescription much more
powerful. When a descriptivist makes a prescription, that means something.

[^3]:
    The video isn't perfect---it was made in 2013, and in 2019 Tom went back and made a bunch of
    corrections in the comments. But for the most part I think the points are sound and he has
    the right idea.

This, I think, is the best argument for leaning towards PL descriptivism. If researchers spend
most of their time in an observational role, understanding the things that programmers need and
building things that fit those needs, then people will be more likely to listen when theres a
real problem that needs a prescribed solution. It's an argument for a certain kind of restraint;
we avoid looking like the boy who cried wolf.

Descriptivism is also a more positive way to be. Prescriptivism is necessarily judgmental and
usually about saying "X is wrong." Personally I think I'd prefer to take things for what they
are. This has the added benefit of providing more access to unbiased opportunities to connect
research to practical problems. By constantly observing and explaining, we get access to the
cutting edge problems that programmers need solved.

## Watch This Space

All of this is to say, in academic contexts, I'm going to try to stop saying that Javascript is
bad. I'm going to try to be a PL descriptivist, putting energy into understanding why certain
language features are popular, rather than into being annoyed that they exist. I think a lot of
this has really just been about being more positive and less judgmental---maybe I could have just
said that---but PL nerds are language nerds, so going via linguistics was fun and (at least for me)
instructive.

I might post again someday about how this philosophy works in practice. Maybe I'll find that being a
descriptivist is too limiting, or I'll get burned too many times by untyped languages and I'll lose
my patience. Or maybe I'll be a better researcher for it. We'll see.

If you want to discuss these ideas, my contact info is in the page footer. I'd love to chat.

<br/>

---

<br/>
