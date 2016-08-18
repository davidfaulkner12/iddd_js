const AssertionConcern = require("../../common/AssertionConcern")

class PostalAddress extends AssertionConcern {
  constructor(aStreetAddress,
      aCity,
      aStateProvince,
      aPostalCode,
      aCountryCode) {
    super()

    this.city = aCity
    this.countryCode = aCountryCode
    this.postalCode = aPostalCode
    this.stateProvince = aStateProvince
    this.streetAddress = aStreetAddress
  }

  get city() {
    return this._city
  }

  get countryCode() {
    return this._countryCode
  }

  get postalCode() {
    return this._postalCode
  }

  get stateProvince() {
    return this._stateProvince
  }

  get streetAddress() {
    return this._streetAddress
  }

  set city(aCity) {
    this.assertArgumentNotEmpty(aCity, "The city is required.")
    this.assertArgumentLength(aCity, 1, 100,
      "The city must be 100 characters or less.")

    this._city = aCity
  }

  set countryCode(aCountryCode) {
    this.assertArgumentNotEmpty(aCountryCode, "The country is required.")
    this.assertArgumentLength(aCountryCode, 2, 2,
      "The country code must be two characters.")

    this._countryCode = aCountryCode
  }

  set postalCode(aPostalCode) {
    this.assertArgumentNotEmpty(aPostalCode,
      "The postal code is required.")
    this.assertArgumentLength(aPostalCode, 5, 12,
      "The postal code must be 12 characters or less.")

    this._postalCode = aPostalCode
  }

  set stateProvince(aStateProvince) {
    this.assertArgumentNotEmpty(aStateProvince,
      "The state/province is required.")
    this.assertArgumentLength(aStateProvince, 2, 100,
      "The state/province must be 100 characters or less.")

    this._stateProvince = aStateProvince
  }

  set streetAddress(aStreetAddress) {
    this.assertArgumentNotEmpty(aStreetAddress,
      "The street address is required.")
    this.assertArgumentLength(aStreetAddress, 1, 100,
      "The street address must be 100 characters or less.")

    this._streetAddress = aStreetAddress
  }
}

module.exports = PostalAddress
