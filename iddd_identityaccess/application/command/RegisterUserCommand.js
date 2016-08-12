const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class RegisterUserCommand extends AssertionConcern {
  constructor(

      tenantId,

      invitationIdentifier,

      username,

      password,

      firstName,

      lastName,

      enabled,

      startDate,

      endDate,

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

    this.assertArgumentNotNull(invitationIdentifier, "invitationIdentifier must be provided.")
    this.assertArgumentTrue(_.isString(invitationIdentifier), "invitationIdentifier must be a String")
    this._invitationIdentifier = invitationIdentifier

    this.assertArgumentNotNull(username, "username must be provided.")
    this.assertArgumentTrue(_.isString(username), "username must be a String")
    this._username = username

    this.assertArgumentNotNull(password, "password must be provided.")
    this.assertArgumentTrue(_.isString(password), "password must be a String")
    this._password = password

    this.assertArgumentNotNull(firstName, "firstName must be provided.")
    this.assertArgumentTrue(_.isString(firstName), "firstName must be a String")
    this._firstName = firstName

    this.assertArgumentNotNull(lastName, "lastName must be provided.")
    this.assertArgumentTrue(_.isString(lastName), "lastName must be a String")
    this._lastName = lastName

    this.assertArgumentNotNull(enabled, "enabled must be provided.")
    this.assertArgumentTrue(_.isBoolean(enabled), "enabled must be a boolean")
    this._enabled = enabled

    this.assertArgumentTrue(startDate == null || _.isDate(startDate), "startDate must be a Date")
    this._startDate = startDate

    this.assertArgumentTrue(endDate == null || _.isDate(endDate), "endDate must be a Date")
    this._endDate = endDate

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
  get invitationIdentifier() {
    return this._invitationIdentifier
  }
  get username() {
    return this._username
  }
  get password() {
    return this._password
  }
  get firstName() {
    return this._firstName
  }
  get lastName() {
    return this._lastName
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

module.exports = RegisterUserCommand
