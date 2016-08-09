const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class AddGroupToGroupCommand extends AssertionConcern {
  constructor(

      tenantId,

      childGroupName,

      parentGroupName
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(childGroupName, "childGroupName must be provided.")
    this.assertArgumentTrue(_.isString(childGroupName), "childGroupName must be a String")
    this._childGroupName = childGroupName

    this.assertArgumentNotNull(parentGroupName, "parentGroupName must be provided.")
    this.assertArgumentTrue(_.isString(parentGroupName), "parentGroupName must be a String")
    this._parentGroupName = parentGroupName

  }

  get tenantId() {
    return this._tenantId
  }
  get childGroupName() {
    return this._childGroupName
  }
  get parentGroupName() {
    return this._parentGroupName
  }
}

module.exports = AddGroupToGroupCommand
