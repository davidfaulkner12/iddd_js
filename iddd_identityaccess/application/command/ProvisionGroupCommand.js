const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ProvisionGroupCommand extends AssertionConcern {
  constructor(

      description,

      groupName,

      tenantId
  ) {
    super()

    this.assertArgumentNotNull(description, "description must be provided.")
    this.assertArgumentTrue(_.isString(description), "description must be a String")
    this._description = description

    this.assertArgumentNotNull(groupName, "groupName must be provided.")
    this.assertArgumentTrue(_.isString(groupName), "groupName must be a String")
    this._groupName = groupName

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

  }

  get description() {
    return this._description
  }
  get groupName() {
    return this._groupName
  }
  get tenantId() {
    return this._tenantId
  }
}

module.exports = ProvisionGroupCommand
