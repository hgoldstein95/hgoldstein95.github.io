---
layout: post
title: Spacemacs is Cool
categories: misc
---

When I first started programming, my teacher forced us to write our code in
Windows notepad. Not even notepad++. Notepad. Looking back, I suppose I
understand his rationale; if we learned to write code with all of the assistance
that an IDE provides, we wouldn't understand what is actually going on.
(Clicking "Run" is a whole lot different from typing `javac` at the command
line, and I'm glad that I started off with that deeper understanding.) By the
time that I was headed to college, I understood that I could be a programmer
even without the bells and whistles of IDEs and code editors.

But not necessarily a *good* programmer.

Since those days, I have learned to rely on and appreciate the tools that are
available to help me do my work. Writing code is constant multitasking: a
programmer is simultaneously solving high level problems and dealing with the
nuance of implementing the solutions. Any experienced programmer will tell you
that it takes a lot of focus to write good code, so I am glad that there is such
a rich ecosystem of tools to make the process of writing code easier. I have
used a number of code editors and IDEs, from Eclipse to Sublime Text to, most
recently, Vim. For the last year or so, I have learned to love Vim and it's
amazingly efficient editing style. It's how I write most of my code, as well as
most things that aren't code. It's completely changed the way that I think about
programming.

Lately, though, I have gotten a little bit frustrated with Vim. While I
appreciate its philosophy of configurability, it has become increasingly
frustrating to actually configure all of the behaviors that I want. I've also
had more and more need for advanced code editing features like debugging and
linting, which are difficult or impossible to actually get set up in Vim.

Enter Emacs.

A few weeks ago, some lucky YouTube video recommendations led me to watch a few
talks on Emacs. From what I could see, it had all of the powerful features that
I was looking for, along with the same level of "hackability" that I had gotten
used to in Vim. Even more importantly, Emacs has `evil-mode`. Evil stands for
**E**xtensible **vi L**ayer, and is basically a full implementation of Vim in
Emacs Lisp. (((Emacs uses a dialect of lisp to configure behavior instead of a
custom language like vimscript.))) That meant that I could have my cake and eat
it too; the editing style of Vim with the power of Emacs.

There was just one problem left to tackle: Emacs pinky. I'll be honest, I don't
have the largest hands in the world, and the thought of reaching for control or
alt any time I wanted to do something was not particularly appealing.

Enter spacemacs.

[Spacemacs](http://spacemacs.org) is a custom Emacs distribution that is built
on `evil-mode` and configured with Vim users in mind. Basically, Spacemacs
changes almost all of the Emacs key-bindings to the spacebar (the "space", in
spacemacs) followed by a short string of characters. For example, `SPC f s`
saves the current buffer, and `SPC g s` displays an interactive window with Git
status information. In keeping with Vim's philosophy, these bindings all all
mnemonic; "f s" corresponds to "file, save", "g s" for "git, status", etc. It
was shocking how quick it was to get used to, and before I knew it I had written
a couple thousand lines of code and this blog post in spacemacs.

So, if you happen to be like me (comfortable with Vim, but looking for a more
powerful code editor), give spacemacs a try. I can say for sure that it is the
first editor in a while that I've felt actually has what I need.
