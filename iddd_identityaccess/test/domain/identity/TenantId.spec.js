let chai = require("chai")
let should = chai.should()

let uuid = require("uuid")

let TenantId = require("../../../domain/identity/TenantId.js")

const FIRST_NAME = "Zoe";
const LAST_NAME = "Doe";
const MARRIED_LAST_NAME = "Jones-Doe";
const WRONG_FIRST_NAME = "Zeo";

describe("TenantId", function() {

  it("Should allow you to construct ", function() {
    let tenantId = new TenantId(uuid.v4())
  })

  it("Should fail on parsing an invalid constructor", function() {
    try {
      let tenantId = new TenantId()
    } catch (err) {
      // Good
      return
    }

    throw new Error("Should not get here")
  })

  it("Should fail on passing not a UUID an invalid constructor", function() {
    try {
      let tenantId = new TenantId("abc123")
    } catch (err) {
      // Good
      return
    }

    throw new Error("Should not get here")
  })
})
