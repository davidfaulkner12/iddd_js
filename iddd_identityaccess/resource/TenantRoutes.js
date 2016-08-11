const ApplicationServiceRegistry = require("../application/ApplicationServiceRegistry")

const Serializer = require("./Serializer")


const getTenant = (request, reply) => {

  let aTenantId = request.params.tenantId

  console.log("Inside handler for tenant", aTenantId)

  let tenant =
          ApplicationServiceRegistry.identityApplicationService
              .tenant(aTenantId)

  if (tenant) {
    reply(Serializer.generateExternalRepresentation(tenant)).type("application/json")
  } else {
    reply('Not found').code(404)
  }
}

module.exports = [
{
  method: 'GET',
  path: '/tenants/{tenantId}',
  handler: getTenant
}
]
