const AssertionConcern = require("../../common/AssertionConcern")
const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

const EmailAddress = ValueObjectGenerator.generate({
  name: "EmailAddress",
  super: AssertionConcern,
  props: [{
    name: "address",
    required: true,
    validate(anAddress) {
      this.assertArgumentLength(anAddress, 1, 100,
        "Email address must be 100 characters or less.")
      this.assertArgumentTrue(
        // Note: I redid the regex here
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(anAddress),
        "Email address format is invalid.")
    }
  }]
})

module.exports = EmailAddress
