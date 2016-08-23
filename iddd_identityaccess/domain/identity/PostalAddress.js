const AssertionConcern = require("../../common/AssertionConcern")
const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

const PostalAddress = ValueObjectGenerator.generate({
  name: "PostalAddress",
  super: AssertionConcern,
  props: [{
    name: "streetAddress",
    required: true,
    validate(aStreetAddress) {
      this.assertArgumentLength(aStreetAddress, 1, 100,
        "The street address must be 100 characters or less.")
    }
  }, {
    name: "city",
    required: true,
    validate(aCity) {
      this.assertArgumentLength(aCity, 1, 100,
        "The city must be 100 characters or less.")
    }
  }, {
    name: "stateProvince",
    required: true,
    validate(aStateProvince) {
      this.assertArgumentLength(aStateProvince, 2, 100,
        "The state/province must be 100 characters or less.")
    }
  }, {
    name: "postalCode",
    required: true,
    validate(aPostalCode) {
      this.assertArgumentNotEmpty(aPostalCode,
        "The postal code is required.")
      this.assertArgumentLength(aPostalCode, 5, 12,
        "The postal code must be 12 characters or less.")
    }
  }, {
    name: "countryCode",
    required: true,
    validate(aCountryCode) {
      this.assertArgumentNotEmpty(aCountryCode, "The country is required.")
      this.assertArgumentLength(aCountryCode, 2, 2,
        "The country code must be two characters.")
    }
  }]
})

module.exports = PostalAddress
