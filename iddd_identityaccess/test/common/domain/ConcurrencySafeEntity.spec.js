const ConcurrencySafeEntity = require("../../../common/domain/ConcurrencySafeEntity")

describe("ConcurrencySafeEntity", function() {

  it("Should construct", function() {
    let cse = new ConcurrencySafeEntity()
  })

  it("Should allow us to set the ConcurrencyVersion to the current version", function() {
    let cse = new ConcurrencySafeEntity()
    let cv = cse.concurrencyVersion
    cse.concurrencyVersion = cv
  })

  it("Should not allow us to set the ConcurrencyVersion to a new value", function() {
    let cse = new ConcurrencySafeEntity()
    let cv = cse.concurrencyVersion
    try {
      cse.concurrencyVersion = cv + 10
    } catch (err) {
      // Do Nothing
      return
    }
    throw new Error("Should never reach here")
  })
})
