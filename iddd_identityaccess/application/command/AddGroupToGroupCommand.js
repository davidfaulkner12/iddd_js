const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "AddGroupToGroupCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "parentGroupName", required: true, type: String},
    {name: "childGroupName", required: true, type: String}
  ]
})
