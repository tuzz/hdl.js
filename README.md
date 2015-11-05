## hardware-description-language

[![Build Status](https://travis-ci.org/tuzz/hdl.js.svg?branch=master)](https://travis-ci.org/tuzz/hdl.js)

This is an attempt at writing a hardware description language that is at least
as powerful as that of the language used in the book ["Elements of Computing
Systems"](http://www.amazon.co.uk/dp/0262640686).

## Setup Instructions

You'll need to have installed [nodejs](https://nodejs.org/en/) first.

Install grunt command line:

```
npm install grunt-cli -g
```

Install the dependent node modules:

```
npm install
```

To run the test suite:

```
grunt
```

You can run a single test by globally installing jasmine-node:

```
npm install jasmine-node -g
```

And then:

```
jasmine-node spec/hdlSpec.js
```

If the suite successfully builds, you can embed the bin/hdl.js file in your
web application. See examples/ for more information.

Let me know if you have trouble with any of this.

## Background

The grammar for the language is more-or-less the same, with a few differences:

- Support for defining truth tables
- Clocking of chips is simpler, you just make use of the 'clocked' chip
- Chip names are not included and will instead be inferred from filenames
- No semicolons
- Comment with # instead of //
- Everything is lowercase

The order in which chips are defined should not matter. You can define chips
that depend on chips that haven't been defined yet. Once all of its dependencies
are defined, you will be able to evaluate expressions on the chip.

## How it works

The parser runs in two passes. It first reads through the input and builds an
intermediate representation, which is just structured data that is easier to
work with.

The second pass makes sense of this structured data and produces a graph. This
graph is then added as a subgraph of a wider 'environment', which connects the
subgraphs together.

Here's an example:

![Example](example.png)

When subgraphs are connected, a topological sort is performed. This determines
the order in which nodes need to be visited to evaluate expressions on the
hardware. HDL is a declarative language, so the user may have specified their
"wiring" in an arbitrary order and this needs to be sorted based on a
dependency graph.

## Evaluation

This project is more than just a way of describing how circuitry is wired
together – it allows you to simulate it too! This is achieved by traversing the
environment graph and recursively evaluating an expression. Eventually, this
recursion bottoms-out on a truth table chip, where the result can bubble back

The algorithm for this is fairly complicated as chips can make use of
intermediate pins and are labelled arbitrary between the implementations of
chips.

## Declarative Programming

This project was taken a step further and ideas of declarative programming were
applied. This allows chips to effectively run in reverse. For example, you
could describe an "adder" chip, then specify a desired output for this chip. It
then attempts to find a set of inputs that make yield the desired output.

It achieves this by reducing the hardware down to SAT by applying the Tseitin
Transformation. You can read more about that [here](https://github.com/computationclub/computationclub.github.io/wiki/The-New-Turing-Omnibus-Chapter-35-Sequential-Sorting#show--tell).

This technique was then used for finding solutions to the [self-enumerating
pangram](https://en.wikipedia.org/wiki/Pangram#Self-enumerating_pangrams)
problem with great success. The resulting SAT equation is able to find a
solution for an arbitrary sentence seed in a few minutes on consumer grade
hardware. This is faster than all other (known) attempts at solving this
problem.

The circuitry for that chip (and a harder variant of the problem) can be found
on branches of this project.

## Future plans

I've since moved on to exploring whether there's a higher-level abstraction that
can be used for describing NP-complete problems to computers. It's a lot of work
to define a chip using HDL and I'd like to explore whether this can be achieved
(and more) through a rich, high-level programming abstraction.

That project is called Sentient and it is [here](https://github.com/tuzz/sentient).

## No longer supported

There are no plans to carry out any more work on this project. Use at your own
risk.
