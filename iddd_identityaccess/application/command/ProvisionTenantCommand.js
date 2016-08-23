const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

module.exports = ValueObjectGenerator.generate({
  name: "ProvisionTenantCommand",
  props: [
    {name: "tenantName", required: true, type: String},
    {name: "tenantDescription", required: true, type: String},
    {name: "administorFirstName", required: true, type: String},
    {name: "administorLastName", required: true, type: String},
    {name: "emailAddress", required: true, type: String},
    {name: "primaryTelephone", required: true, type: String},
    {name: "secondaryTelephone", required: true, type: String},
    {name: "addressStreetAddress", required: true, type: String},
    {name: "addressCity", required: true, type: String},
    {name: "addressStateProvince", required: true, type: String},
    {name: "addressPostalCode", required: true, type: String},
    {name: "addressCountryCode", required: true, type: String}
  ]
})
