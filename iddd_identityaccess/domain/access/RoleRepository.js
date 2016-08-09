const InMemoryRepository = require("../identity/InMemoryRepository")

const _ = require("underscore")

class RoleRepository extends InMemoryRepository {

  constructor() {
    super()
  }

  keyOf(aRole) {
    return aRole.tenantId + "#" + aRole.name
  }

  allRoles(aTenantId) {
    return _.filter(this.repository, (role) => {
      return role.tenantId == aTenantId
    })
  }

  roleNamed(aTenantId, aRoleName) {
      return this.repository[aTenantId + "#" + aRoleName];
  }

}

module.exports = RoleRepository
