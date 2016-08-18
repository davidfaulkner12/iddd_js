const TenantId = require("../domain/identity/TenantId")
const GroupMemberService = require("../domain/identity/GroupMemberService")

class AccessApplicationService {
  constructor(aGroupRepository, aRoleRepository,
      aTenantRepository, aUserRepository) {
    this.groupRepository = aGroupRepository
    this.roleRepository = aRoleRepository
    this.tenantRepository = aTenantRepository
    this.userRepository = aUserRepository
  }

  assignUserToRole(aCommand) {
    let tenantId = new TenantId(aCommand.tenantId)

    let user =
      this.userRepository
      .userWithUsername(
        tenantId,
        aCommand.username)

    if (user) {
      let role =
        this.roleRepository
        .roleNamed(
          tenantId,
          aCommand.roleName)

      if (role) {
        role.assignUser(user)
      }
    }
  }

  isUserInRole(aTenantId, aUsername, aRoleName) {
    let user = this.userInRole(aTenantId, aUsername, aRoleName)

    return Boolean(user)
  }

  userInRole(aTenantId, aUsername, aRoleName) {
    let userInRole = null

    let tenantId = new TenantId(aTenantId)

    let user =
      this.userRepository
      .userWithUsername(
        tenantId,
        aUsername)

    if (user) {
      let role =
        this.roleRepository
        .roleNamed(tenantId, aRoleName)

      if (role) {
        let groupMemberService =
          new GroupMemberService(
            this.userRepository,
            this.groupRepository)

        if (role.isInRole(user, groupMemberService)) {
          userInRole = user
        }
      }
    }

    return userInRole
  }

  provisionRole(aCommand) {
    let tenantId = new TenantId(aCommand.tenantId)

    let tenant = this.tenantRepository.tenantOfId(tenantId)

    let role =
      tenant.provisionRole(
        aCommand.roleName,
        aCommand.description,
        aCommand.supportsNesting)

    this.roleRepository.add(role)
  }
}

module.exports = AccessApplicationService
