const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "DeactivateTenantCommand",
  props: [
    {name: "tenantId", type: String, required: true}
  ]
})
