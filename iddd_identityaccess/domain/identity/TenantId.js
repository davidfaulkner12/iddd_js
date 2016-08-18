const AbstractId = require("../../common/domain/AbstractId")

class TenantId extends AbstractId {

  validateId(anId) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(anId)) {
      throw new Error("IllegalArgument: The id has an invalid format.")
    }
  }
}

module.exports = TenantId
