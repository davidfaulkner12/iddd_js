const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ChangeUserPasswordCommand",
  props: [
    {name: "tenantId", required: true, type: String},
    {name: "username", required: true, type: String},
    {name: "currentPassword", required: true, type: String},
    {name: "changedPassword", required: true, type: String}
  ]
})
