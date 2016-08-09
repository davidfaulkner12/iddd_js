const chai = require("chai")
const should = chai.should()

const Tenant = require("../../../domain/identity/Tenant")
const DomainEventPublisher = require("../../../common/domain/DomainEventPublisher")
const DomainRegistry = require("../../../domain/DomainRegistry")

const {
  ContactInformation,
  EmailAddress,
  PostalAddress,
  Telephone,
  FullName,
  Enablement
} = require("../../../domain/identity/IdentityValueObjects")

const fixture = require("../IdentityAccessFixtures")

describe("Tenant", function() {

  afterEach(function() {
    // TODO Figure out how to do this better
    // it works in the Java because the transactions rollback
    fixture.tenantAggregate().registrationInvitations = []
  })

  it("Should provision from the service", function(done) {

    let p1 = new Promise(
      (resolve, reject) => {
        DomainEventPublisher.subscribe("TenantProvisioned", (evt) => {
          resolve()
        })
      })

    let p2 = new Promise(
      (resolve, reject) => {
        DomainEventPublisher.subscribe("TenantAdministratorRegistered",
          (evt) => {
            resolve()
          })
      })

    let tenant =
      DomainRegistry
      .tenantProvisioningService
      .provisionTenant(
        fixture.TENANT_NAME,
        fixture.TENANT_DESCRIPTION,
        new FullName("John", "Doe"),
        new EmailAddress(fixture.USER_EMAIL_ADDRESS),
        new PostalAddress(
          "123 Pearl Street",
          "Boulder",
          "CO",
          "80301",
          "US"),
        new Telephone("303-555-1210"),
        new Telephone("303-555-1212"));

    should.exist(tenant.tenantId);
    should.exist(tenant.tenantId.id);
    tenant.tenantId.id.length.should.equal(36)
    fixture.TENANT_NAME.should.equal(tenant.name)
    fixture.TENANT_DESCRIPTION.should.equal(tenant.description)

    Promise.all([p1, p2]).then(() => {
      done()
    })
  })

  it("CreateOpenEndedInvitation", function() {

    let tenant = fixture.tenantAggregate()

    tenant
      .offerRegistrationInvitation("Open-Ended")
      .openEnded()

    should.exist(tenant.redefineRegistrationInvitationAs("Open-Ended"))
  })

  it("OpenEndedInvitationAvailable", function() {

    let tenant = fixture.tenantAggregate()

    tenant
      .offerRegistrationInvitation("Open-Ended")
      .openEnded()

    tenant.isRegistrationAvailableThrough("Open-Ended").should.be.true
  })

  it("ClosedEndedInvitationAvailable", function() {

    let tenant = fixture.tenantAggregate();

    tenant
      .offerRegistrationInvitation("Today-and-Tomorrow")
      .startingOn(fixture.today())
      .until(fixture.tomorrow());

    tenant.isRegistrationAvailableThrough("Today-and-Tomorrow").should.be.true
  })

  it("ClosedEndedInvitationNotAvailable", function() {

    let tenant = fixture.tenantAggregate();

    tenant
      .offerRegistrationInvitation("Tomorrow-and-Day-After-Tomorrow")
      .startingOn(fixture.tomorrow())
      .until(fixture.dayAfterTomorrow());

    tenant.isRegistrationAvailableThrough("Tomorrow-and-Day-After-Tomorrow").should.be.false
  })

  it("AvailableInivitationDescriptor", function() {

    let tenant = fixture.tenantAggregate();

    tenant
      .offerRegistrationInvitation("Open-Ended")
      .openEnded();

    tenant
      .offerRegistrationInvitation("Today-and-Tomorrow")
      .startingOn(fixture.today())
      .until(fixture.tomorrow());

    tenant.allAvailableRegistrationInvitations().length.should.equal(2)
  })

  it("UnavailableInivitationDescriptor", function() {

    let tenant = fixture.tenantAggregate();

    tenant
      .offerRegistrationInvitation("Tomorrow-and-Day-After-Tomorrow")
      .startingOn(fixture.tomorrow())
      .until(fixture.dayAfterTomorrow())

    tenant.allUnavailableRegistrationInvitations().length.should.equal(1)
  })

  it("RegisterUser", function() {

    let tenant = fixture.tenantAggregate();

    let registrationInvitation =
      fixture.registrationInvitationEntity(tenant);

    let user =
      tenant.registerUser(
        registrationInvitation.invitationId,
        fixture.USERNAME,
        fixture.PASSWORD,
        new Enablement(true, null, null),
        fixture.personEntity(tenant));

    should.exist(user)

    DomainRegistry.userRepository.add(user);

    should.exist(user.enablement)
    should.exist(user.person)
    should.exist(user.userDescriptor)
  })
})
