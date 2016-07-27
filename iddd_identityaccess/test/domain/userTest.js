var chai = require("chai")
var should = chai.should()

let User = require("../../domain/user.js")

describe("User", function() {
  it ("Should construct", function() {
    let myUser = new User("test")
    myUser.name.should.equal("test")
  })
})
