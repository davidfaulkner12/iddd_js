const AssertionConcern = require("../../common/AssertionConcern")
const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

const Enablement = ValueObjectGenerator.generate({
  name: "Enablement",
  super: AssertionConcern,
  props: [{
    name: "enabled",
    required: true,
    type: Boolean
  }, {
    name: "startDate",
    type: Date
  }, {
    name: "endDate",
    type: Date,
    validate(anEndDate, that) {
      if (that.startDate || anEndDate) {
        this.assertArgumentNotNull(that.startDate,
          "The start date must be provided.")
        this.assertArgumentNotNull(anEndDate, "The end date must be provided.")
        this.assertArgumentFalse(that.startDate > anEndDate,
          "Enablement start and/or end date is invalid.")
      }
    }
  }],
  methods: {
    isEnablementEnabled() {
      let enabled = false

      if (this.enabled) {
        if (!this.isTimeExpired()) {
          enabled = true
        }
      }

      return enabled
    },

    isTimeExpired() {
      let timeExpired = false
      if (this.startDate && this.endDate) {
        let now = new Date()

        if (now < this.startDate || now > this.endDate) {
          timeExpired = true
        }
      }

      return timeExpired
    }
  }

})

Enablement.indefiniteEnablement = function() {
  return new Enablement(true, null, null)
}

module.exports = Enablement
