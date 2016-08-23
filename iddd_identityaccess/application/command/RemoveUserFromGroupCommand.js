const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "RemoveUserFromGroupCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "groupName", required: true, type: String},
    {name: "username", required: true, type: String}
  ]
})
