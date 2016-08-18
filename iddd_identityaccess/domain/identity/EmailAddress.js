const AssertionConcern = require("../../common/AssertionConcern")

class EmailAddress extends AssertionConcern {
  constructor(anAddress) {
    super()
    this.address = anAddress

    // TODO Copy Constructor
  }

  get address() {
    return this._address
  }

  set address(anAddress) {
    this.assertArgumentNotEmpty(anAddress, "The email address is required.")
    this.assertArgumentLength(anAddress, 1, 100,
      "Email address must be 100 characters or less.")
    this.assertArgumentTrue(
      // Note: I redid the regex here
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(anAddress),
      "Email address format is invalid.")

    this._address = anAddress
  }

}

module.exports = EmailAddress
