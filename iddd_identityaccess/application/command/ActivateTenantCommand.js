const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ActivateTenantComand",
  props: [
    {name: "tenantId", type: String, required: true}
  ]
})
