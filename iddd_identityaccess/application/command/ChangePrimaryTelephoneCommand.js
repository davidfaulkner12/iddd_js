const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ChangePrimaryTelephoneCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "username", required: true, type: String},
    {name: "telephone", required: true, type: String}
  ]
})
