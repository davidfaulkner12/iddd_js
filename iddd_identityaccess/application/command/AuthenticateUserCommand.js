const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class AuthenticateUserCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      password
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(password, "password must be provided.")
    this.assertArgumentTrue(_.isString(password), "password must be a String")
    this._password = password

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get password() {
    return this._password
  }
}

module.exports = AuthenticateUserCommand
