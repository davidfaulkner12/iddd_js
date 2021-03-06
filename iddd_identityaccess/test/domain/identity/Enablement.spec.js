/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

require("chai").should()

const Enablement = require("../../../domain/identity/Enablement")

const fixture = require("../IdentityAccessFixtures")

describe("Enablement", function() {
  it("Should be enabled", function() {
    let enablement = new Enablement(true, null, null)

    enablement.isEnablementEnabled().should.be.true
  })

  it("Enablement should be disabled", function() {
    let enablement = new Enablement(false, null, null)
    enablement.isEnablementEnabled().should.be.false
  })

  it("EnablementOutsideStartEndDates", function() {
    let enablement =
      new Enablement(
        true,
        fixture.dayBeforeYesterday(),
        fixture.yesterday())

    enablement.isEnablementEnabled().should.be.false
  })

  it("EnablementUnsequencedDates", function() {
    let failure = false

    try {
      new Enablement(
        true,
        fixture.tomorrow(),
        fixture.today())
    } catch (err) {
      failure = true
    }

    failure.should.be.true
  })

  it("EnablementEndsTimeExpired", function() {
    let enablement =
      new Enablement(
        true,
        fixture.dayBeforeYesterday(),
        fixture.yesterday())

    enablement.isTimeExpired().should.be.true
  })

  it("EnablementHasNotBegunTimeExpired", function() {
    let enablement =
      new Enablement(
        true,
        fixture.tomorrow(),
        fixture.dayAfterTomorrow())

    enablement.isTimeExpired().should.be.true
  })
})
