const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class AddGroupToGroupCommand extends AssertionConcern {
  constructor(

      tenantId,

      parentGroupName,

      childGroupName
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(parentGroupName, "parentGroupName must be provided.")
    this.assertArgumentTrue(_.isString(parentGroupName), "parentGroupName must be a String")
    this._parentGroupName = parentGroupName

    this.assertArgumentNotNull(childGroupName, "childGroupName must be provided.")
    this.assertArgumentTrue(_.isString(childGroupName), "childGroupName must be a String")
    this._childGroupName = childGroupName

  }

  get tenantId() {
    return this._tenantId
  }
  get parentGroupName() {
    return this._parentGroupName
  }
  get childGroupName() {
    return this._childGroupName
  }
}

module.exports = AddGroupToGroupCommand
