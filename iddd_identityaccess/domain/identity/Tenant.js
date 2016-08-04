const uuid = require("uuid")
const _ = require("underscore")

const ConcurrencySafeEntity = require("../../common/domain/ConcurrencySafeEntity")
const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")

const RegistrationInvitation = require("./RegistrationInvitation")
const User = require("../User")
const Role = require("../access/Role")

class Tenant extends ConcurrencySafeEntity {
  constructor(aTenantId, aName, aDescription, anActive) {
    super()

    this.active = anActive;
    this.description = aDescription
    this.name = aName
    this.tenantId = aTenantId

    this.registrationInvitations = []
  }

  offerRegistrationInvitation(aDescription) {
    this.assertStateTrue(this.active, "Tenant is not active.");

    this.assertStateFalse(
      this.isRegistrationAvailableThrough(aDescription),
      "Invitation already exists.");

    let invitation =
      new RegistrationInvitation(
        this.tenantId,
        uuid.v4(),
        aDescription);

    let added = this.registrationInvitations.push(invitation)

    this.assertStateTrue(added, "The invitation should have been added.");

    return invitation;
  }

  isRegistrationAvailableThrough(anInvitationIdentifier) {
    this.assertStateTrue(this.active, "Tenant is not active.");

    let invitation =
      this.invitation(anInvitationIdentifier);

    return invitation == null ? false : invitation.available;
  }

  invitation(anInvitationIdentifier) {
    return _.find(this.registrationInvitations, (item) => {
      return item.isIdentifiedBy(anInvitationIdentifier)
    })
  }

  registerUser(
    anInvitationIdentifier,
    aUsername,
    aPassword,
    anEnablement,
    aPerson) {

    this.assertStateTrue(this.active, "Tenant is not active.");

    let user = null;

    if (this.isRegistrationAvailableThrough(anInvitationIdentifier)) {

      // ensure same tenant
      aPerson.tenantId = this.tenantId;

      user = new User(
        this.tenantId,
        aUsername,
        aPassword,
        anEnablement,
        aPerson);
    }

    return user;
  }

  withdrawInvitation(anInvitationIdentifier) {

    this.registrationInvitations = _.reject(this.registrationInvitations, (item) => {
      return item.isIdentifiedBy(anInvitationIdentifier)
    })

  }

  provisionRole(aName, aDescription, aSupportsNesting = false) {
    this.assertStateTrue(this.active, "Tenant is not active.");

    let role = new Role(this.tenantId, aName, aDescription, aSupportsNesting)

    DomainEventPublisher
      .publish("RoleProvisioned", {
          tenantId: this.tenantId,
          name: aName
        })

        return role;
      }

  }

  module.exports = Tenant
