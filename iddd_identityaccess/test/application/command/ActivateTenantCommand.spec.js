/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
const should = chai.should()

const {
  ActivateTenantCommand
} = require("../../../application/command/Commands")

const TenantRepository = require("../../../domain/identity/TenantRepository")

const tenantRepository = new TenantRepository()

describe("ActivateTentantCommand", function() {
  it("Is creatable", function() {
    let myId = tenantRepository.nextIdentity()
    let myActivateTenantCommand = new ActivateTenantCommand(myId.id)
    should.exist(myActivateTenantCommand.tenantId)
  })

  it("Should not allow a null command to be created", function() {
    let errorOccured = false
    try {
      new ActivateTenantCommand()
    } catch (err) {
      errorOccured = true
    }
    errorOccured.should.be.true
  })

  it("Should not allow a numeric argument", function() {
    let errorOccured = false
    try {
      new ActivateTenantCommand(4)
    } catch (err) {
      errorOccured = true
    }
    errorOccured.should.be.true
  })
})
