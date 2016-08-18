const AssertionConcern = require("../AssertionConcern")

class AbstractId extends AssertionConcern {

  constructor(anId) {
    super()
    this.id = anId
  }

  get id() {
    return this._id
  }

  validateId(anId) {
    // implemented by subclasses for validation.
    // throws a runtime exception if invalid.
  }

  set id(anId) {
    this.assertArgumentNotEmpty(anId, "The basic identity is required.")
    this.assertArgumentLength(anId, 36,
      "The basic identity must be 36 characters.")

    this.validateId(anId)

    this._id = anId
  }

}

module.exports = AbstractId
