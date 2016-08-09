const {
  ContactInformation,
  EmailAddress,
  PostalAddress,
  Telephone,
  TenantId,
  Enablement,
  FullName
} = require("../../domain/identity/IdentityValueObjects")
const Person = require("../../domain/identity/Person")

const uuid = require("uuid")
const DomainRegistry = require("../../domain/DomainRegistry")
const User = require("../../domain/user")
const Tenant = require("../../domain/identity/Tenant")

const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")

let fixture = {}

const USER_EMAIL_ADDRESS = fixture.USER_EMAIL_ADDRESS = "jdoe@saasovation.com"
fixture.USER_EMAIL_ADDRESS2 = "zdoe@saasovation.com"

const TWENTY_FOUR_HOURS = fixture.TWENTY_FOUR_HOURS = (1000 * 60 * 60 * 24)

fixture.today = function() {
  return new Date()
}

fixture.tomorrow = function() {
  return new Date(fixture.today().valueOf() + TWENTY_FOUR_HOURS)
}

fixture.yesterday = function() {
  return new Date(fixture.today().valueOf() - TWENTY_FOUR_HOURS)
}

fixture.dayBeforeYesterday = function() {
  return new Date(fixture.today().valueOf() - TWENTY_FOUR_HOURS * 2)
}

fixture.dayAfterTomorrow = function() {
  return new Date(fixture.today().valueOf() + TWENTY_FOUR_HOURS * 2)
}

fixture.contactInformation = function() {
  let contactInformation =
    new ContactInformation(
      new EmailAddress(USER_EMAIL_ADDRESS),
      new PostalAddress(
        "123 Pearl Street",
        "Boulder",
        "CO",
        "80301",
        "US"),
      new Telephone("303-555-1210"),
      new Telephone("303-555-1212"));
  return contactInformation
}


fixture.PASSWORD = "SecretPassword!"
fixture.TENANT_DESCRIPTION = "This is a test tenant."
fixture.TENANT_NAME = "Test Tenant"

fixture.USERNAME = "jdoe"
fixture.USERNAME2 = "zdoe"

let tempTenant = null

fixture.tenantAggregate = function() {
  if (tempTenant == null) {
    let tenantId =
      DomainRegistry.tenantRepository.nextIdentity();

    tempTenant =
      new Tenant(
        tenantId,
        fixture.TENANT_NAME,
        fixture.TENANT_DESCRIPTION,
        true)

    DomainRegistry.tenantRepository.add(tempTenant);
  }

  return tempTenant
}

fixture.personEntity = function(aTenant) {

  let person =
    new Person(
      aTenant.tenantId,
      new FullName("John", "Doe"),
      fixture.contactInformation());

  return person;
}

fixture.personEntity2 = function(aTenant) {

  let person =
    new Person(
      aTenant.tenantId,
      new FullName("Zoe", "Doe"),
      new ContactInformation(
        new EmailAddress(fixture.USER_EMAIL_ADDRESS2),
        new PostalAddress(
          "123 Pearl Street",
          "Boulder",
          "CO",
          "80301",
          "US"),
        new Telephone("303-555-1210"),
        new Telephone("303-555-1212")));

  return person;
}

fixture.userAggregate = function() {

  let tenant = this.tenantAggregate();

  let registrationInvitation =
    this.registrationInvitationEntity(tenant);

  let user =
    tenant.registerUser(
      registrationInvitation.invitationId,
      fixture.USERNAME,
      fixture.PASSWORD,
      new Enablement(true, null, null),
      fixture.personEntity(tenant));

  return user;

}

fixture.userAggregate2 = function() {

  let tenant = this.tenantAggregate();

  let registrationInvitation =
    this.registrationInvitationEntity(tenant);

  let user =
    tenant.registerUser(
      registrationInvitation.invitationId,
      fixture.USERNAME2,
      fixture.PASSWORD,
      new Enablement(true, null, null),
      this.personEntity2(tenant));

  return user;

}

fixture.registrationInvitationEntity = function(aTenant) {

  let registrationInvitation =
    aTenant.offerRegistrationInvitation("Today-and-Tomorrow:" + Math.random())
    .startingOn(fixture.today())
    .until(fixture.tomorrow())

  return registrationInvitation

}

fixture.clean = function() {
  DomainRegistry.groupRepository.clean()
  DomainRegistry.userRepository.clean()
  DomainRegistry.roleRepository.clean()
  DomainEventPublisher.reset()
  fixture.tenantAggregate().registrationInvitations = []
}

module.exports = fixture
