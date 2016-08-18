const _ = require("underscore")

const AssertionConcern = require("../../common/AssertionConcern")

class FullName extends AssertionConcern {
  constructor() {
    super()

    if (arguments.length === 1 && arguments[0] instanceof FullName) {
      this.firstName = arguments[0].firstName
      this.lastName = arguments[0].lastName
    } else if (arguments.length === 2 &&
        _.isString(arguments[0]) && _.isString(arguments[1])) {
      this.firstName = arguments[0]
      this.lastName = arguments[1]
    } else {
      throw new Error(
        "IllegalArgument: FullName must be called with either a FullName" +
        "to copy or two Strings")
    }
  }

  asFormattedName() {
    return this.firstName + " " + this.lastName
  }

  withChangedFirstName(aFirstName) {
    return new FullName(aFirstName, this.lastName)
  }

  withChangedLastName(aLastName) {
    return new FullName(this.firstName, aLastName)
  }

  set firstName(aFirstName) {
    this.assertArgumentNotEmpty(aFirstName, "First name is required.")
    this.assertArgumentLength(aFirstName, 1, 50,
      "First name must be 50 characters or less.")
    this.assertArgumentTrue(
      /^[A-Z][a-z]*/.test(aFirstName),
      "First name must be at least one character in length," +
      "starting with a capital letter.")
    this._firstName = aFirstName
  }

  set lastName(aLastName) {
    this.assertArgumentNotEmpty(aLastName, "The last name is required.")
    this.assertArgumentLength(aLastName, 1, 50,
      "The last name must be 50 characters or less.")
    this.assertArgumentTrue(
      /^[a-zA-Z'][ a-zA-Z'-]*[a-zA-Z']?/.test(aLastName),
      "Last name must be at least one character in length.")

    this._lastName = aLastName
  }

  get firstName() {
    return this._firstName
  }

  get lastName() {
    return this._lastName
  }

}

module.exports = FullName
