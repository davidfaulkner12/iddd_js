const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class AddUserToGroupCommand extends AssertionConcern {
  constructor(

      tenantId,

      groupName,

      username
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(groupName, "groupName must be provided.")
    this.assertArgumentTrue(_.isString(groupName), "groupName must be a String")
    this._groupName = groupName

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

  }

  get tenantId() {
    return this._tenantId
  }
  get groupName() {
    return this._groupName
  }
  get username() {
    return this._username
  }
}

module.exports = AddUserToGroupCommand
