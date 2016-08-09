const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ChangeUserPersonalNameCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      firstName,

      lastName
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(firstName, "firstName must be provided.")
    this.assertArgumentTrue(_.isString(firstName), "firstName must be a String")
    this._firstName = firstName

    this.assertArgumentNotNull(lastName, "lastName must be provided.")
    this.assertArgumentTrue(_.isString(lastName), "lastName must be a String")
    this._lastName = lastName

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get firstName() {
    return this._firstName
  }
  get lastName() {
    return this._lastName
  }
}

module.exports = ChangeUserPersonalNameCommand
