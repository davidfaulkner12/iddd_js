/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
chai.should()

const AssertionConcern = require('../../common/AssertionConcern')

let fixtureAssertionConcern = () => {
  return new AssertionConcern()
}

let fShouldThrowBob = (f, ...args) => {
  try {
    f.apply(null, args)
  } catch (err) {
    err.message.should.contain("bob")
    return true
  }

  return false
}

describe("AssertionConcern", function() {
  it(`Should not throw an error when we assert the state or
    argument is false and it's false`, function() {
    let fas = fixtureAssertionConcern()
    fas.assertStateFalse(false, "")
    fas.assertStateTrue(true, "")
    fas.assertArgumentFalse(false, "")
    fas.assertArgumentTrue(true, "")
  })

  it("Throws an error when we assert state is false and it's true", function() {
    fShouldThrowBob(fixtureAssertionConcern().assertStateFalse, true, "bob")
      .should.be.true
  })

  it("Throws an error when we assert state is true and it's false", function() {
    fShouldThrowBob(fixtureAssertionConcern().assertStateTrue, false, "bob")
      .should.be.true
  })

  it("Throws an error when we assert argument is false and it's true",
    function() {
      fShouldThrowBob(fixtureAssertionConcern().assertArgumentFalse, true, "bob")
        .should.be.true
    })

  it("Throws an error when we assert argument is true and it's false",
    function() {
      fShouldThrowBob(fixtureAssertionConcern().assertArgumentTrue, false, "bob")
        .should.be.true
    })

  it("Should not do anything when the number is within a range for int and double",
    function() {
      let fas = fixtureAssertionConcern()
      fas.assertArgumentRange(2, 1, 3, "")
      fas.assertArgumentRange(2.5, .5, 5.5, "")
    })

  it("Should throw an error when the number is out of range for an int",
    function() {
      let fas = fixtureAssertionConcern()

      fShouldThrowBob(fas.assertArgumentRange, 0, 1, 3, "bob")
        .should.be.true

      fShouldThrowBob(fas.assertArgumentRange, 5, 1, 3, "bob")
        .should.be.true
    })

  it("Should throw an error when the number is out of range for an float",
    function() {
      fShouldThrowBob(fixtureAssertionConcern().assertArgumentRange, 0.1, 1.5, 3.5, "bob")
        .should.be.true

      fShouldThrowBob(fixtureAssertionConcern().assertArgumentRange, 5, 1.2, 3.9, "bob")
        .should.be.true
    })

  it("Should not throw an error when any object is not null", function() {
    let fas = fixtureAssertionConcern()
    fas.assertArgumentNotNull({}, "")
    fas.assertArgumentNotNull(1, "")
  })

  it("Should throw an error for a null argument", function() {
    fShouldThrowBob(fixtureAssertionConcern().assertArgumentNotNull,
        null, "bob")
      .should.be.true
  })

  it("Should not throw an error for a non-empty string", function() {
    let fas = fixtureAssertionConcern()
    fas.assertArgumentNotEmpty("bob", "")
  })

  it("Should throw an error for a null string", function() {
    fShouldThrowBob(fixtureAssertionConcern().assertArgumentNotEmpty, null, "bob")
      .should.be.true
  })

  it("Should throw an error an empty string", function() {
    fShouldThrowBob(fixtureAssertionConcern().assertArgumentNotEmpty, "", "bob")
      .should.be.true
  })

  it("Should not throw an error on a string within range", function() {
    let fas = fixtureAssertionConcern()

    fas.assertArgumentLength("abc", 4, "")
    fas.assertArgumentLength("abc", 1, 4, "")
  })

  it("Should throw an error for a string length out of range", function() {
    let fas = fixtureAssertionConcern()

    fShouldThrowBob(fas.assertArgumentLength, "abc", 2, "bob")
      .should.be.true

    fShouldThrowBob(fas.assertArgumentLength, "abc", 4, 7, "bob")
      .should.be.true
  })

  it("Should not throw an error for equal objects", function() {
    let fas = fixtureAssertionConcern()

    fas.assertArgumentEquals({}, {}, "")
    fas.assertArgumentEquals({
      bob: "abc"
    }, {
      bob: "abc"
    })

    fas.assertArgumentEquals(null, null, "")
  })

  it("Should throw an error for unequal objects", function() {
    let fas = fixtureAssertionConcern()

    fShouldThrowBob(fas.assertArgumentEquals, {}, {
      bob: "abc"
    },
    "bob"
    ).should.be.true
  })

  it("Should throw an error for equal objects", function() {
    let fas = fixtureAssertionConcern()

    fShouldThrowBob(fas.assertArgumentNotEquals, {}, {}, "bob").should.be.true
    fShouldThrowBob(fas.assertArgumentNotEquals, {
      bob: "abc"
    }, {
      bob: "abc"
    },
    "bob"
    ).should.be.true

    fShouldThrowBob(fas.assertArgumentNotEquals, null, null, "bob").should.be.true
  })

  it("Should not throw an error for unequal objects", function() {
    let fas = fixtureAssertionConcern()

    fas.assertArgumentNotEquals({}, {
      bob: "abc"
    },
    "bob"
    )
  })
})
