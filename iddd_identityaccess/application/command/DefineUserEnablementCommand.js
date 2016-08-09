const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class DefineUserEnablementCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      enabled,

      startDate,

      endDate
  ) {
    super()

    this.assertArgumentNotNull(tenantId, "tenantId must be provided.")
    this.assertArgumentTrue(_.isString(tenantId), "tenantId must be a String")
    this._tenantId = tenantId

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(enabled, "enabled must be provided.")
    this.assertArgumentTrue(_.isBoolean(enabled), "enabled must be a boolean")
    this._enabled = enabled

    this.assertArgumentNotNull(startDate, "startDate must be provided.")
    this.assertArgumentTrue(_.isDate(startDate), "startDate must be a Date")
    this._startDate = startDate

    this.assertArgumentNotNull(endDate, "endDate must be provided.")
    this.assertArgumentTrue(_.isDate(endDate), "endDate must be a Date")
    this._endDate = endDate

  }

  get tenantId() {
    return this._tenantId
  }
  get username() {
    return this._username
  }
  get enabled() {
    return this._enabled
  }
  get startDate() {
    return this._startDate
  }
  get endDate() {
    return this._endDate
  }
}

module.exports = DefineUserEnablementCommand
