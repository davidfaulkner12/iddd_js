
// Removing useless entity in class hierarchy for now

const IdentifiedDomainObject = require("./IdentifiedDomainObject")

class ConcurrencySafeEntity extends IdentifiedDomainObject {

    constructor() {
        super()
        this._concurrencyVersion = -1
    }

    get concurrencyVersion() {
      return this._concurrencyVersion
    }

    set concurrencyVersion (aVersion) {
      this.failWhenConcurrencyViolation(aVersion)
      this._concurrencyVersion = aVersion
    }

    failWhenConcurrencyViolation(aVersion) {
      if (aVersion != this.concurrencyVersion) {
        throw new Error(
                "Concurrency Violation: Stale data detected. Entity was already modified.")
      }
    }
}

module.exports = ConcurrencySafeEntity
