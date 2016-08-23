const AssertionConcern = require("../../common/AssertionConcern")
const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

const Telephone = ValueObjectGenerator.generate({
  name: "Telephone",
  super: AssertionConcern,
  props: [{
    name: "number",
    required: true,
    validate(aNumber) {
      this.assertArgumentLength(aNumber, 5, 20,
        "Telephone number may not be more than 20 characters.")
      this.assertArgumentTrue(
        /(\d{3}-)?\d{3}-(\d{3})|(\d{4})/.test(aNumber),
        "Telephone number or its format is invalid.")
    }
  }]
})

module.exports = Telephone
