const AssertionConcern = require("../../common/AssertionConcern")
const DomainRegistry = require("../DomainRegistry")

class AuthorizationService extends AssertionConcern {


  constructor(
    aUserRepository,
    aGroupRepository,
    aRoleRepository) {

    super()

    this.groupRepository = aGroupRepository;
    this.roleRepository = aRoleRepository;
    this.userRepository = aUserRepository;
  }

  isUserInRoleByUsername(aTenantId, aUsername, aRoleName) {
    this.assertArgumentNotNull(aTenantId, "TenantId must not be null.");
    this.assertArgumentNotEmpty(aUsername, "Username must not be provided.");
    this.assertArgumentNotEmpty(aRoleName, "Role name must not be null.");

    let user = this.userRepository.userWithUsername(aTenantId, aUsername);

    return user == null ? false : this.isUserInRole(user, aRoleName);
  }

  isUserInRole(aUser, aRoleName) {
    this.assertArgumentNotNull(aUser, "User must not be null.");
    this.assertArgumentNotEmpty(aRoleName, "Role name must not be null.");

    let authorized = false;

    if (aUser.enabled) {
      let role = this.roleRepository.roleNamed(aUser.tenantId, aRoleName);

      if (role != null) {
        authorized = role.isInRole(aUser, DomainRegistry.groupMemberService);
      }
    }

    return authorized;
  }
}

module.exports = AuthorizationService
