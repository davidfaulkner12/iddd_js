const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ChangeUserPasswordCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      currentPassword,

      changedPassword
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(currentPassword, "currentPassword must be provided.")
    this.assertArgumentTrue(_.isString(currentPassword), "currentPassword must be a String")
    this._currentPassword = currentPassword

    this.assertArgumentNotNull(changedPassword, "changedPassword must be provided.")
    this.assertArgumentTrue(_.isString(changedPassword), "changedPassword must be a String")
    this._changedPassword = changedPassword

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get currentPassword() {
    return this._currentPassword
  }
  get changedPassword() {
    return this._changedPassword
  }
}

module.exports = ChangeUserPasswordCommand
