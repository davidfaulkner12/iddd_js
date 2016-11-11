This is a sample Bounded Contexts from the book
"Implementing Domain-Driven Design" by Vaughn Vernon ported to JavaScript:

http://vaughnvernon.co/?page_id=168

This port has in no way been endorsed by the author in any fashion.

## What do you mean, ported to JavaScript?

I did a port by hand to explore how to implement these concepts in node.js.
There is an accompanying blog series available here:

* [Part 1: Running the Original](http://david.wangfaulkner.com/iddd-in-javascript-part-1-running-the-original)
* [Part 2: Tests and Decisions](http://david.wangfaulkner.com/iddd-in-javascript-part-2-tests-and-decisions)

Each blog post is backed by a branch -- there are descriptions of this in the blog post. You can see the evolution of this port by looking at the branches in
order.

## Why did you do this?

For fun! I explain my motivations in the blog, but I wanted to explore what it would mean to write JavaScript in this very structured, disciplined way, and which pieces would feel natural and which pieces would not.

I am explicitly NOT saying that this is a production ready system. I punted on a lot of stuff that would be necessary to make this real -- the repositories are in memory, there are no transactions, and the event mechanism is very, very, very naïve.
