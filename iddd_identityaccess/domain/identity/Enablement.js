const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")

class Enablement extends AssertionConcern {

  constructor(anEnabled, aStartDate, anEndDate) {
    super()

    this.assertArgumentTrue(_.isBoolean(anEnabled),
      "The first argument must be a boolean")
    this.assertArgumentTrue(!aStartDate || _.isDate(aStartDate),
      "The second argument must be a date")
    this.assertArgumentTrue(!anEndDate || _.isDate(anEndDate),
      "The third argument must be a date")

    if (aStartDate || anEndDate) {
      this.assertArgumentNotNull(aStartDate, "The start date must be provided.")
      this.assertArgumentNotNull(anEndDate, "The end date must be provided.")
      this.assertArgumentFalse(aStartDate > anEndDate,
        "Enablement start and/or end date is invalid.")
    }

    this.enabled = anEnabled
    this.endDate = anEndDate
    this.startDate = aStartDate
  }

  isEnablementEnabled() {
    let enabled = false

    if (this.enabled) {
      if (!this.isTimeExpired()) {
        enabled = true
      }
    }

    return enabled
  }

  isTimeExpired() {
    let timeExpired = false
    if (this.startDate && this.endDate) {
      let now = new Date()

      if (now < this.startDate ||
        now > this.endDate) {
        timeExpired = true
      }
    }

    return timeExpired
  }

  static indefiniteEnablement() {
    return new Enablement(true, null, null)
  }

}

module.exports = Enablement
