/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
const should = chai.should()

const _ = require("underscore")

const AssertionConcern = require("../../common/AssertionConcern")

const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

describe("ValueObjectGenerator", function() {
  it("Generates a value object that can be newed", function() {
    let Foo = ValueObjectGenerator.generate({})
    let myFoo = new Foo()
    should.exist(myFoo)
  })

  it("Generates a value object with a set of properties", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: ["a", "b"]
    })
    let myFoo = new Foo("avalue", "bvalue")
    should.exist(myFoo.a)
    should.exist(myFoo.b)
    myFoo.a.should.equal("avalue")
    myFoo.b.should.equal("bvalue")
  })

  it("Should have a name", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: ["a", "b"]
    })
    Foo.prototype.name.should.equal("Foo")
  })

  it("Should enforce validation rules", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: ["a", "b"]
    })

    let errorOccurred = false

    try {
      new Foo("avalue", "bvalue", "cvalue")
    } catch (err) {
      errorOccurred = true
    }

    errorOccurred.should.be.true
  })

  it("Should enforce additional validation rules", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: [
        "a", {
          name: "b",
          required: true
        }
      ]
    })

    let errorOccurred = false

    try {
      new Foo("a")
    } catch (err) {
      errorOccurred = true
    }

    errorOccurred.should.be.true
  })

  it("Should allow for a custom validation method", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: [{
        name: "a",
        required: true,
        validate: (value) => {
          if (!_.isString(value)) {
            throw new Error("Should be a string!")
          }
        }
      }]
    })
    let myFoo = new Foo("bob")

    myFoo.a.should.equal("bob")
  })

  it("Should allow for a custom validation method", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: [{
        name: "a",
        required: true,
        validate: (value) => {
          if (!_.isString(value)) {
            throw new Error("Should be a string!")
          }
        }
      }]
    })

    let errorOccurred = false

    try {
      new Foo(1)
    } catch (err) {
      errorOccurred = true
    }

    errorOccurred.should.be.true
  })

  it("Should allow for a custom validation method from a superclass",
    function() {
      let Foo = ValueObjectGenerator.generate({
        name: "Foo",
        super: AssertionConcern,
        props: [{
          name: "a",
          required: true,
          validate: function(value) {
            this.assertArgumentNotEmpty(value)
          }
        }]
      })

      let myFoo = new Foo("bob")

      myFoo.a.should.equal("bob")
    }
  )

  it("Should allow for a custom superclass method that fails", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: [{
        name: "a",
        required: true,
        validate: function(value) {
          this.assertAgumentNotEmpty(value)
        }
      }]
    })

    let errorOccurred = false

    try {
      new Foo("")
    } catch (err) {
      errorOccurred = true
    }

    errorOccurred.should.be.true
  })

  it("Should allow for custom methods", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: ["a", "b"],
      methods: {
        ab: function() {
          return this.a + this.b
        }
      }
    })

    let myFoo = new Foo("bob", "dole")

    myFoo.ab().should.equal("bobdole")
  })

  it("Should give me a copy constructor for free!", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: "a"
    })

    let myFoo1 = new Foo("bob")

    let myFoo2 = new Foo(myFoo1)

    myFoo2.a.should.equal("bob")
  })

  it("Should enforce a type check", function() {
    let Foo = ValueObjectGenerator.generate({
      name: "Foo",
      props: [{
        name: "a",
        type: String
      }]
    })

    let errorOccurred = false

    try {
      new Foo(34)
    } catch (err) {
      errorOccurred = true
    }

    errorOccurred.should.be.true
  })
})
