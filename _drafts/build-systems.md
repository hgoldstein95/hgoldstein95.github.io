---
layout: post
title: Building Code is Hard
categories: misc
---

Sally the programmer has written some code, and she wants it to run somewhere.
Let's say that her code is a simple command line application written in Java.
She just has one file to compile, and she can probably run something like
```
javac MyProgram.java
```
to get a Java bytecode file that she can run with `java`. Great! That was easy.

Later, Sally's project has gotten a little more complicated. Now she has a few
files to compile together, and she also has an external `jar` file to include.
She can still do this all with `javac`, passing in each file (or a file glob)
along with a classpath declaration for the included library. Maybe the command
ends up looking like
```
javac MyProgram.java MyHelper1.java MyHelper2.java -cp libs/lib.jar
```
Well, that still wasn't awful. But this is pretty close to the limit for what
`javac` is capable of. It can't, for instance:

- Download `lib` from an external source and keep it up to date.
- Only compile files that have changed since the last build.
- Handle files in other languages, running appropriate compilers for those files
  and linking the build outputs together.
- Package the bytecode files into an execuatble file.

In fact, it's probably good that `javac` *can't* do these things. The `javac`
program is a compiler for Java code---and that's all it needs to be. However, we
do need some kind of program to do these more complicated things for us; these
programs are, generally, called build systems.

## Build Systems
As programmers, we should care about how our code is being built. The ideal
build system would be
- Fast: We can't afford to waste developer hours waiting for a slow build.
- Flexible: Projects should be able to be structured in whatever way makes the
  most sense.
- Debuggable: Build system bugs can very time consuming to fix, because it is
  often hard to tell that there's anything wrong with the build at all.
- Language Agnostic: If my company wants to incorporate some C (or maybe Rust?)
  code to speed up an important component, I shouldn't have to incorporate a new
  build system from scratch.
- Powerful: I shouldn't have to write extra scripts to do things that my build
  system can't.
