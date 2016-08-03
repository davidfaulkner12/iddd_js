const AssertionConcern = require("../AssertionConcern")

class IdentifiedDomainObject extends AssertionConcern {

  constructor() {
    super()
    this.id = -1
  }

}

module.exports = IdentifiedDomainObject
