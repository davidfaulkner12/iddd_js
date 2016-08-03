let chai = require("chai")
let should = chai.should()

let FullName = require("../../../domain/identity/FullName.js")

const FIRST_NAME = "Zoe";
const LAST_NAME = "Doe";
const MARRIED_LAST_NAME = "Jones-Doe";
const WRONG_FIRST_NAME = "Zeo";

describe("FullName", function() {

  it("Should not allow you to construct with a number ", function() {
    try {
      let name = new FullName("Bob", 1)
    } catch (err) {
      // Good
      return
    }

    throw new Error("Shouldn't be here!")
  })

  it("Should have a formatted name", function() {
    let name = new FullName(FIRST_NAME, LAST_NAME)
    name.asFormattedName().should.equal(FIRST_NAME + " " + LAST_NAME)
  })

  it("Should have a copy constructor", function() {
    let name = new FullName(WRONG_FIRST_NAME, LAST_NAME)
    let newName = new FullName(name)
    newName.asFormattedName().should.equal(WRONG_FIRST_NAME + " " + LAST_NAME)
  })

  it("Should have a changed first name", function() {
    let name = new FullName(WRONG_FIRST_NAME, LAST_NAME)
    name = name.withChangedFirstName(FIRST_NAME)
    name.asFormattedName().should.equal(FIRST_NAME + " " + LAST_NAME)
  })

  it("Should have changed last name", function() {
    let name = new FullName(FIRST_NAME, LAST_NAME)
    name = name.withChangedLastName(MARRIED_LAST_NAME)
    name.asFormattedName().should.equal(FIRST_NAME + " " + MARRIED_LAST_NAME)
  })

})
