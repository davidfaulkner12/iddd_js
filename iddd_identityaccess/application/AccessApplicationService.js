

class AccessApplicationService {
  constructor(aGroupRepository, aRoleRepository, aTenantRepository, aUserRepository) {
    this.groupRepository = aGroupRepository
    this.aRoleRepository = aRoleRepository
    this.aTenantRepository = aTenantRepository
    this.aUserRepository = aUserRepository
  }

}

module.exports = AccessApplicationService
