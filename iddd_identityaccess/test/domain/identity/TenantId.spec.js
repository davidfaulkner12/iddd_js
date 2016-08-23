const chai = require("chai")
const should = chai.should()

const uuid = require("uuid")

const TenantId = require("../../../domain/identity/TenantId")

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
