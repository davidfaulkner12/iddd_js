const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ProvisionRoleCommand extends AssertionConcern {
  constructor(

      tenantId,

      roleName,

      description,

      supportsNesting
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(roleName, "roleName must be provided.")
    this.assertArgumentTrue(_.isString(roleName), "roleName must be a String")
    this._roleName = roleName

    this.assertArgumentNotNull(description, "description must be provided.")
    this.assertArgumentTrue(_.isString(description), "description must be a String")
    this._description = description

    this.assertArgumentNotNull(supportsNesting, "supportsNesting must be provided.")
    this.assertArgumentTrue(_.isBoolean(supportsNesting), "supportsNesting must be a boolean")
    this._supportsNesting = supportsNesting

  }

  get tenantId() {
    return this._tenantId
  }
  get roleName() {
    return this._roleName
  }
  get description() {
    return this._description
  }
  get supportsNesting() {
    return this._supportsNesting
  }
}

module.exports = ProvisionRoleCommand
