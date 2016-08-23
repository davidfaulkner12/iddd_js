const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ProvisionRoleCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "roleName", required: true, type: String},
    {name: "description", required: true, type: String},
    {name: "supportsNesting", required: true, type: Boolean}
  ]
})
