const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ProvisionGroupCommand extends AssertionConcern {
  constructor(

      tenantId,

      groupName,

      description
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(groupName, "groupName must be provided.")
    this.assertArgumentTrue(_.isString(groupName), "groupName must be a String")
    this._groupName = groupName

    this.assertArgumentNotNull(description, "description must be provided.")
    this.assertArgumentTrue(_.isString(description), "description must be a String")
    this._description = description

  }

  get tenantId() {
    return this._tenantId
  }
  get groupName() {
    return this._groupName
  }
  get description() {
    return this._description
  }
}

module.exports = ProvisionGroupCommand
