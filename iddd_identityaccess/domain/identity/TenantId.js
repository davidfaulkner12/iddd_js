
let AbstractId = require("../../common/domain/AbstractId.js")

class TenantId extends AbstractId {
  constructor(anId) {
    // Add validation
    super(anId)

    //TODO Copy Constructor
  }

  validateId(anId) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(anId)) {
          throw new IllegalArgumentException("The id has an invalid format.");
      }
  }
}

module.exports = TenantId
