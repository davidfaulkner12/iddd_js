const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ChangeEmailAddressCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      emailAddress
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(emailAddress, "emailAddress must be provided.")
    this.assertArgumentTrue(_.isString(emailAddress), "emailAddress must be a String")
    this._emailAddress = emailAddress

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get emailAddress() {
    return this._emailAddress
  }
}

module.exports = ChangeEmailAddressCommand
