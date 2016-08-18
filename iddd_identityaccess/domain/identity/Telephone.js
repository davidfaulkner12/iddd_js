const AssertionConcern = require("../../common/AssertionConcern")

class Telephone extends AssertionConcern {

  constructor(aNumber) {
    // TODO Copy constructor
    super()
    this.number = aNumber
  }

  get number() {
    return this._number
  }

  set number(aNumber) {
    this.assertArgumentNotEmpty(aNumber, "Telephone number is required.")
    this.assertArgumentLength(aNumber, 5, 20,
      "Telephone number may not be more than 20 characters.")
    this.assertArgumentTrue(
      /(\d{3}-)?\d{3}-(\d{3})|(\d{4})/.test(aNumber),
      "Telephone number or its format is invalid.")

    this._number = aNumber
  }
}

module.exports = Telephone
