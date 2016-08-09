const DomainRegistry = require("../domain/DomainRegistry")
const AccessApplicationService = require("./AccessApplicationService")

module.exports.accessApplicationService = new AccessApplicationService(DomainRegistry.groupRepository, DomainRegistry.roleRepository, DomainRegistry.tenantRepository, DomainRegistry.userRepository)
