const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ProvisionGroupCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "groupName", required: true, type: String},
    {name: "description", required: true, type: String}
  ]
})
