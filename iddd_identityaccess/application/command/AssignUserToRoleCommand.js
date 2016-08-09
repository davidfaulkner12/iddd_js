const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class AssignUserToRoleCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      roleName
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(roleName, "roleName must be provided.")
    this.assertArgumentTrue(_.isString(roleName), "roleName must be a String")
    this._roleName = roleName

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get roleName() {
    return this._roleName
  }
}

module.exports = AssignUserToRoleCommand
