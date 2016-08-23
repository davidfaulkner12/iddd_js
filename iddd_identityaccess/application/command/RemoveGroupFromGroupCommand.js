const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "RemoveGroupFromGroupCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "parentGroupName", required: true, type: String},
    {name: "childGroupName", required: true, type: String}
  ]
})
