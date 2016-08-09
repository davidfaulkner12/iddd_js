const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class DeactivateTenantCommand extends AssertionConcern {
  constructor(

      tenantId
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

  }

  get tenantId() {
    return this._tenantId
  }
}

module.exports = DeactivateTenantCommand
