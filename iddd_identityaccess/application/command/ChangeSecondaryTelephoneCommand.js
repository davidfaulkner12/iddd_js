const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ChangeSecondaryTelephoneCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      telephone
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(telephone, "telephone must be provided.")
    this.assertArgumentTrue(_.isString(telephone), "telephone must be a String")
    this._telephone = telephone

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get telephone() {
    return this._telephone
  }
}

module.exports = ChangeSecondaryTelephoneCommand
