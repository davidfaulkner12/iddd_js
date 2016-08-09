const DomainRegistry = require("../domain/DomainRegistry")
const AccessApplicationService = require("./AccessApplicationService")
const IdentityApplicationService = require("./IdentityApplicationService")

module.exports.accessApplicationService = new AccessApplicationService(DomainRegistry.groupRepository, DomainRegistry.roleRepository, DomainRegistry.tenantRepository, DomainRegistry.userRepository)

module.exports.identityApplicationService = new IdentityApplicationService(
  DomainRegistry.authenticationService,
  DomainRegistry.groupMemberService,
  DomainRegistry.groupRepository,
  DomainRegistry.tenantProvisioningService,
  DomainRegistry.tenantRepository,
  DomainRegistry.userRepository
)
