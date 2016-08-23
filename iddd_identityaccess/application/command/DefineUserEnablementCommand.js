const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "DefineUserEnablementCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "username", required: true, type: String},
    {name: "enabled", required: true, type: Boolean},
    {name: "startDate", required: true, type: Date},
    {name: "endDate", required: true, type: Date}
  ]
})
