const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ChangeEmailAddressCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "username", required: true, type: String},
    {name: "emailAddress", required: true, type: String}
  ]
})
