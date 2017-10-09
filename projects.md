---
layout: page
title: Projects
permalink: /projects/
---

This page catalogs some of the projects that I have worked on in the past, as
well as a few that I am working on right now. If you have any questions about
these or other projects that I have been involved with, don't hesitate to
contact me.

## Opal
I am currently working with Adrian Sampson at Cornell on a language called Opal.
The language has built-in abstractions to make writing machine learning
applications easier.

The research that I am currently doing involves creating typed abstractions for
various machine learning workflows. I worked for a while on a type system for
features; Opal now has supports type-safe features that mitigate mistakes when
working with large datasets. More recently, I have been working on typed
interactions with natural language systems. We want to allow programmers using
NLU systems to generate configurations from the types in their program.

<br>

---
<br>

## Last Second Beach
![Last Second Beach](../img/lsb.png){:height="200px" style="float:right; margin-left: 15px"}

*Last Second Beach, LLC* is a small start-up that I had the pleasure of
co-founding in 2016. I was brought on by Khalid Ladha and Zacharia Demuth as CTO
to provide a technical perspective for the budding travel-technology company.
We hoped to create a mobile distribution channel for cruises and one-price
vacations, a market segment that has traditionally been slow to adapt to changes
in technology.

While the company has since become mostly inactive, we did win first place (and
$25,000) at the Cornell School of Hotel Administration at their Business Plan
competition.

<br>

---
<br>

## ASL Glove
![ASL Glove](../img/aslglove.jpeg){:height="300px" style="float:left; margin-right: 15px"}

For our high school senior project, my partner and I designed and created a
glove that interprets letters in the American Sign Language alphabet and prints
the letters to a computer screen. The translation happens in real time, as a
person forms the letters with his or her hand. The glove also allowed the user
to play *Rock, Paper, Scissors* against the computer.

We detected the user's hand position using custom-made optical bend sensors,
which we made from aquarium tubing and photodiodes. With these sensors, we were
able to get a general idea of how much each of the user's fingers was beinding.
Hall effect sensors and magnets mounted between the fingers allowed us to get
more precise measurements. We used a TI microcontroller to interpret the signals
and pass them on to a computer, at which point a Python script did the final
translation and printed out the results.

<br>

---
<br>

## n-Body Simulation
![n-Body Simulation](../img/nbody.png){:height="300px" style="float:right; margin-left: 15px"}

The n-body problem in calculus is often used to show the limitations of symbolic
integration. It can be thought of as modeling several planets in gravitational
orbit. When there are two planets, symbolic integration suffices to determine
their paths; when there are three or more planets symbolic integration becomes
impossible.

In order to simulate the motion of these planets, each "step" of each planet's
motion must be calculated as a combination of the gravitational effects of all
planets around it. My project partner and I used the Runge-Kutta method of
numerical integration to find the paths of any number of planets in orbit. We
developed a graphical user interface using vPython and wxPython that allows a
user to set initial conditions and view a simulation.

Check out the project [here](https://github.com/hgoldstein95/n-body-simulator).

<br>

---
<br>


## *Mafia* Web App
*Mafia* is a strategic party game played by many at Cornell. The game is both
logical and psychological---ometimes players need to use the facts at their
disposal to draw conclusions, and other times they need to "read" other players
to determine who is lying.

As co-presidents of the Cornell Mafia club, a friend and I decided to create a
web application to make playing the game easier. The each game is run by a
"moderator", but sometimes that person's job can be farly difficult. We created
a node.js app using Meteor that provided tools to make moderating easier.
