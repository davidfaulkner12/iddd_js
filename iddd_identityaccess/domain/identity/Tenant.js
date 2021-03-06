const uuid = require("uuid")
const _ = require("underscore")

const ConcurrencySafeEntity =
  require("../../common/domain/ConcurrencySafeEntity")
const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")

const RegistrationInvitation = require("./RegistrationInvitation")
const User = require("../User")
const Role = require("../access/Role")
const Group = require("./Group")

class Tenant extends ConcurrencySafeEntity {
  constructor(aTenantId, aName, aDescription, anActive) {
    super()

    this.active = anActive
    this.description = aDescription
    this.name = aName
    this.tenantId = aTenantId

    this.registrationInvitations = []
  }

  offerRegistrationInvitation(aDescription) {
    this.assertStateTrue(this.active, "Tenant is not active.")

    this.assertStateFalse(
      this.isRegistrationAvailableThrough(aDescription),
      "Invitation already exists.")

    let invitation =
      new RegistrationInvitation(
        this.tenantId,
        uuid.v4(),
        aDescription)

    let added = this.registrationInvitations.push(invitation)

    this.assertStateTrue(added, "The invitation should have been added.")

    return invitation
  }

  isRegistrationAvailableThrough(anInvitationIdentifier) {
    this.assertStateTrue(this.active, "Tenant is not active.")

    let invitation =
      this.invitation(anInvitationIdentifier)

    return invitation ? invitation.available : false
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
    this.assertStateTrue(this.active, "Tenant is not active.")

    let user = null

    if (this.isRegistrationAvailableThrough(anInvitationIdentifier)) {
      // ensure same tenant
      aPerson.tenantId = this.tenantId

      user = new User(
        this.tenantId,
        aUsername,
        aPassword,
        anEnablement,
        aPerson)
    }

    return user
  }

  withdrawInvitation(anInvitationIdentifier) {
    this.registrationInvitations = _.reject(this.registrationInvitations,
      (item) => {
        return item.isIdentifiedBy(anInvitationIdentifier)
      }
    )
  }

  provisionRole(aName, aDescription, aSupportsNesting = false) {
    this.assertStateTrue(this.active, "Tenant is not active.")

    let role = new Role(this.tenantId, aName, aDescription, aSupportsNesting)

    DomainEventPublisher
      .publish("RoleProvisioned", {
        tenantId: this.tenantId,
        name: aName
      })

    return role
  }

  redefineRegistrationInvitationAs(anInvitationIdentifier) {
    this.assertStateTrue(this.active, "Tenant is not active.")

    let invitation =
      this.invitation(anInvitationIdentifier)

    if (invitation !== null) {
      invitation.redefineAs().openEnded()
    }

    return invitation
  }

  allAvailableRegistrationInvitations() {
    this.assertStateTrue(this.active, "Tenant is not active.")

    return this._allRegistrationInvitationsFor(true)
  }

  allUnavailableRegistrationInvitations() {
    this.assertStateTrue(this.active, "Tenant is not active.")

    return this._allRegistrationInvitationsFor(false)
  }

  _allRegistrationInvitationsFor(isAvailable) {
    return _.filter(this.registrationInvitations, (invitation) => {
      return isAvailable === invitation.available
    })
  }

  provisionGroup(aName, aDescription) {
    this.assertStateTrue(this.active, "Tenant is not active.")

    let group = new Group(this.tenantId, aName, aDescription)

    DomainEventPublisher
      .instance()
      .publish("GroupProvisioned", {
        tenantId: this.tenantId,
        name: aName
      })

    return group
  }

  activate() {
    if (!this.active) {
      this.active = true

      DomainEventPublisher
        .publish("TenantActivated", {
          tenantId: this.tenantId
        })
    }
  }

  deactivate() {
    if (this.active) {
      this.active = false

      DomainEventPublisher
        .publish("TenantDeactivated", {
          tenantId: this.tenantId
        })
    }
  }

}

module.exports = Tenant
