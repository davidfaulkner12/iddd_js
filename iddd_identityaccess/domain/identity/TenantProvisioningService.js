const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")

const Tenant = require("./Tenant")
const { Enablement, ContactInformation } = require("./IdentityValueObjects")
const Person = require("./Person")
const DomainRegistry = require("../DomainRegistry")

class TenantProvisioningService {
  constructor(aTenantRepository, aUserRepository, aRoleRepository) {
    this._tenantRepository = aTenantRepository
    this._userRepository = aUserRepository
    this._roleRepository = aRoleRepository
  }

  provisionTenant(
    aTenantName,
    aTenantDescription,
    anAdministorName,
    anEmailAddress,
    aPostalAddress,
    aPrimaryTelephone,
    aSecondaryTelephone) {

    let tenant = new Tenant(
        this._tenantRepository.nextIdentity(),
        aTenantName,
        aTenantDescription,
        true) // must be active to register admin

    this._tenantRepository.add(tenant);

    this.registerAdministratorFor(
      tenant,
      anAdministorName,
      anEmailAddress,
      aPostalAddress,
      aPrimaryTelephone,
      aSecondaryTelephone);


    DomainEventPublisher
      .publish("TenantProvisioned", {
        tenantId: tenant.tenantId
      });

    return tenant;

  }

  registerAdministratorFor(
    aTenant,
    anAdministorName,
    anEmailAddress,
    aPostalAddress,
    aPrimaryTelephone,
    aSecondaryTelephone) {

    let invitation =
      aTenant.offerRegistrationInvitation("init").openEnded()

    let strongPassword =
      DomainRegistry
      .passwordService
      .generateStrongPassword();

    let admin =
      aTenant.registerUser(
        invitation.invitationId,
        "admin",
        strongPassword,
        Enablement.indefiniteEnablement(),
        new Person(
          aTenant.tenantId,
          anAdministorName,
          new ContactInformation(
            anEmailAddress,
            aPostalAddress,
            aPrimaryTelephone,
            aSecondaryTelephone)));

    aTenant.withdrawInvitation(invitation.invitationId);

    this._userRepository.add(admin);

    let adminRole =
      aTenant.provisionRole(
        "Administrator",
        "Default " + aTenant.name + " administrator.");

    adminRole.assignUser(admin);

    this._roleRepository.add(adminRole);

    DomainEventPublisher.publish(
      "TenantAdministratorRegistered", {
        tenantId: aTenant.tenantId,
        tenantName: aTenant.name,
        administratorName: anAdministorName,
        emailAddress: anEmailAddress,
        username: admin.username,
        password: strongPassword
      })
  }
}

module.exports = TenantProvisioningService
