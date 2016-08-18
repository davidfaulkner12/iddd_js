const User = require("../User")

const AssertionConcern = require("../../common/AssertionConcern")

class AuthenticationService extends AssertionConcern {

  constructor(
    aTenantRepository,
    aUserRepository,
    anEncryptionService) {
    super()

    this.encryptionService = anEncryptionService
    this.tenantRepository = aTenantRepository
    this.userRepository = aUserRepository
  }

  authenticate(
    aTenantId,
    aUsername,
    aPassword) {
    this.assertArgumentNotNull(aTenantId, "TenantId must not be null.")
    this.assertArgumentNotEmpty(aUsername, "Username must be provided.")
    this.assertArgumentNotEmpty(aPassword, "Password must be provided.")

    let userDescriptor = User.nullDescriptorInstance()

    let tenant = this.tenantRepository.tenantOfId(aTenantId)

    if (tenant && tenant.active) {
      let encryptedPassword = this.encryptionService.encryptedValue(aPassword)

      let user =
        this.userRepository
        .userFromAuthenticCredentials(
          aTenantId,
          aUsername,
          encryptedPassword)

      if (user && user.enabled) {
        userDescriptor = user.userDescriptor
      }
    }

    return userDescriptor
  }
}

module.exports = AuthenticationService
