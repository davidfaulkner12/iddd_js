const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class ChangeContactInfoCommand extends AssertionConcern {
  constructor(

      tenantId,

      username,

      emailAddress,

      primaryTelephone,

      secondaryTelephone,

      addressStreetAddress,

      addressCity,

      addressStateProvince,

      addressPostalCode,

      addressCountryCode
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

    this.assertArgumentNotNull(primaryTelephone, "primaryTelephone must be provided.")
    this.assertArgumentTrue(_.isString(primaryTelephone), "primaryTelephone must be a String")
    this._primaryTelephone = primaryTelephone

    this.assertArgumentNotNull(secondaryTelephone, "secondaryTelephone must be provided.")
    this.assertArgumentTrue(_.isString(secondaryTelephone), "secondaryTelephone must be a String")
    this._secondaryTelephone = secondaryTelephone

    this.assertArgumentNotNull(addressStreetAddress, "addressStreetAddress must be provided.")
    this.assertArgumentTrue(_.isString(addressStreetAddress), "addressStreetAddress must be a String")
    this._addressStreetAddress = addressStreetAddress

    this.assertArgumentNotNull(addressCity, "addressCity must be provided.")
    this.assertArgumentTrue(_.isString(addressCity), "addressCity must be a String")
    this._addressCity = addressCity

    this.assertArgumentNotNull(addressStateProvince, "addressStateProvince must be provided.")
    this.assertArgumentTrue(_.isString(addressStateProvince), "addressStateProvince must be a String")
    this._addressStateProvince = addressStateProvince

    this.assertArgumentNotNull(addressPostalCode, "addressPostalCode must be provided.")
    this.assertArgumentTrue(_.isString(addressPostalCode), "addressPostalCode must be a String")
    this._addressPostalCode = addressPostalCode

    this.assertArgumentNotNull(addressCountryCode, "addressCountryCode must be provided.")
    this.assertArgumentTrue(_.isString(addressCountryCode), "addressCountryCode must be a String")
    this._addressCountryCode = addressCountryCode

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
  get primaryTelephone() {
    return this._primaryTelephone
  }
  get secondaryTelephone() {
    return this._secondaryTelephone
  }
  get addressStreetAddress() {
    return this._addressStreetAddress
  }
  get addressCity() {
    return this._addressCity
  }
  get addressStateProvince() {
    return this._addressStateProvince
  }
  get addressPostalCode() {
    return this._addressPostalCode
  }
  get addressCountryCode() {
    return this._addressCountryCode
  }
}

module.exports = ChangeContactInfoCommand
