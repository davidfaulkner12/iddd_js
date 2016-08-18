const ApplicationServiceRegistry =
  require("../application/ApplicationServiceRegistry")

const {AuthenticateUserCommand} = require("../application/command/Commands")
const {UserRepresentation, UserInRoleRepresentation} =
  require("../application/representation/UserRepresentations")
const Serializer = require("./Serializer")

const getAuthenticUser = (request, reply) => {
  let aTenantId = request.params.tenantId
  let aUsername = request.params.username
  let aPassword = request.params.password

  console.log("Inside handler for tenant", aTenantId, "and user", aUsername)

  let userDescriptor =
          ApplicationServiceRegistry.identityApplicationService
              .authenticateUser(
                new AuthenticateUserCommand(aTenantId, aUsername, aPassword))

  if (userDescriptor && !userDescriptor.nullDescriptor) {
    reply(Serializer.generateExternalRepresentation(userDescriptor))
      .type("application/json")
  } else {
    reply('Not found').code(404)
  }
}

const getUser = (request, reply) => {
  let aTenantId = request.params.tenantId
  let aUsername = request.params.username

  console.log("Inside handler for tenant", aTenantId, "and user", aUsername)

  let user =
          ApplicationServiceRegistry.identityApplicationService
              .user(aTenantId, aUsername)
  if (user) {
    let userRepresentation = new UserRepresentation(user)
    reply(Serializer.generateExternalRepresentation(userRepresentation))
    .type("application/json")
  } else {
    reply('Not found').code(404)
  }
}

const getUserInRole = (request, reply) => {
  let aTenantId = request.params.tenantId
  let aUsername = request.params.username
  let aRoleName = request.params.role

  console.log("Inside role for tenant", aTenantId,
    "user", aUsername, "role", aRoleName)

  let user =
          ApplicationServiceRegistry.accessApplicationService
          .userInRole(aTenantId, aUsername, aRoleName)

  if (user) {
    let userRepresentation = new UserInRoleRepresentation(user, aRoleName)
    reply(Serializer.generateExternalRepresentation(userRepresentation))
      .type("application/json")
  } else {
    reply('Not found').code(204)
  }
}
module.exports = [
  {
    method: 'GET',
    path: '/tenants/{tenantId}/users/{username}/authenticatedWith/{password}',
    handler: getAuthenticUser
  }, {
    method: 'GET',
    path: '/tenants/{tenantId}/users/{username}',
    handler: getUser
  }, {
    method: 'GET',
    path: '/tenants/{tenantId}/users/{username}/inRole/{role}',
    handler: getUserInRole
  }
]
