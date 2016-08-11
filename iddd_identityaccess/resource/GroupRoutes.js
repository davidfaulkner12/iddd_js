const ApplicationServiceRegistry = require("../application/ApplicationServiceRegistry")
const Serializer = require("./Serializer")

const getGroup = (request, reply) => {

  let aTenantId = request.params.tenantId
  let aGroupName = request.params.groupName

  console.log("Inside handler for tenant", aTenantId, "and group", aGroupName)

  let group =
          ApplicationServiceRegistry.identityApplicationService
              .group(aTenantId, aGroupName)

  if (group) {
    reply(Serializer.generateExternalRepresentation(group)).type("application/json")
  } else {
    reply('Not found').code(404)
  }
}

module.exports = [
{
  method: 'GET',
  path: '/tenants/{tenantId}/groups/{groupName}',
  handler: getGroup
}
]
