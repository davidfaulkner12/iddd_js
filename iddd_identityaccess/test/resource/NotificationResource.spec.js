const should = require("chai").should()
const rest = require("restling")

const _ = require("underscore")

const ApplicationServiceRegistry = require("../../application/ApplicationServiceRegistry")
const {
  RegisterUserCommand,
  ChangeEmailAddressCommand,
  ProvisionTenantCommand
} = require("../../application/command/Commands")
const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")
const DomainRegistry = require("../../domain/DomainRegistry")
const notificationRoutes = require("../../resource/NotificationRoutes")

const resourceFixture = require("./ResourceFixture")
const fixture = require("../domain/IdentityAccessFixtures")

describe("notificationResource", function() {

  before(function(done) {
    resourceFixture.startWithRoutes(notificationRoutes, done)
  })

  after(function(done) {
    resourceFixture.stop(done)
  })

  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("BasicNotificationLog", function(done) {
    generateUserEvents()

    let currentNotificationLog =
      ApplicationServiceRegistry
      .notificationApplicationService
      .currentNotificationLog()

    should.exist(currentNotificationLog)

    let url = `${resourceFixture.baseUrl}/notifications`

    rest.get(url)
      .then(response => {
        //console.log("Response:", response.data)
        _.each(response.data.notifications, (notification) => {
          let typeName = notification.typeName
          let expectedTypes = typeName.endsWith("UserRegistered") ||
            typeName.endsWith("PersonNameChanged") ||
            typeName.endsWith("UserPasswordChanged")

          expectedTypes.should.be.true

        })
      }).then(done, err => done(err))
  })

  it("PersonContactInformationChangedNotification", function(done) {
    generateUserEvents()

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserEmailAddress(
        new ChangeEmailAddressCommand(
          fixture.tenantAggregate().tenantId.id,
          fixture.USERNAME + 0,
          fixture.USER_EMAIL_ADDRESS2))

    let url = `${resourceFixture.baseUrl}/notifications`

    rest.get(url)
      .then(response => {
        let log = response.data

        log.archived.should.be.false
        should.exist(log.id)

        let contactNotification = _.findWhere(log.notifications, {
          typeName: "PersonContactInformationChanged"
        })

        should.exist(contactNotification)

        contactNotification.event.contactInformation.emailAddress.address
          .should.equal(fixture.USER_EMAIL_ADDRESS2)


      }).then(done, err => done(err))

  })
  it("TenantProvisionedNotification", function(done) {
    let newTenant =
      ApplicationServiceRegistry
      .identityApplicationService
      .provisionTenant(
        new ProvisionTenantCommand(
          "All-Star Tenant",
          "An all-star company.",
          "Frank", "Oz",
          "frank@allstartcompany.com",
          "212-555-1211",
          "212-555-1212",
          "123 5th Avenue",
          "New York",
          "NY",
          "11201",
          "US"))

    should.exist(newTenant)

    let url = `${resourceFixture.baseUrl}/notifications`

    rest.get(url)
      .then(response => {
        let log = response.data
        log.archived.should.be.false
        should.exist(log.id)

        let tenantNotification = _.findWhere(log.notifications, {
          typeName: "TenantProvisioned"
        })

        should.exist(tenantNotification)

        tenantNotification.event.tenantId.id
          .should.equal(newTenant.tenantId.id)


      }).then(done, err => done(err))
  })

  it("NotificationNavigation", function(done) {
    let url = `${resourceFixture.baseUrl}/notifications`

    rest.get(url)
      .then(response => {
        let log = response.data
        log.archived.should.be.false
        should.exist(log.id)
        should.not.exist(log.nextLink)
        should.exist(log.selfLink)
        should.exist(log.previousLink)

        return rest.get(log.previousLink)
      }).then(response => {
        let log = response.data
        log.archived.should.be.true
        should.exist(log.id)
        should.exist(log.nextLink)
        should.exist(log.selfLink)

        return rest.get(log.nextLink)
      }).then(response => {
        let log = response.data
        log.archived.should.be.false
        should.exist(log.id)
        should.not.exist(log.nextLink)
        should.exist(log.selfLink)
      }).then(done, err => done(err))
  })
})

function generateUserEvents() {
  let tenant = fixture.tenantAggregate();
  let person = fixture.userAggregate().person;

  let invitationId =
    tenant.allAvailableRegistrationInvitations()[0].invitationId

  for (let idx = 0; idx < 25; ++idx) {

    let user =
      ApplicationServiceRegistry
      .identityApplicationService
      .registerUser(
        new RegisterUserCommand(
          tenant.tenantId.id,
          invitationId,
          fixture.USERNAME + idx,
          fixture.PASSWORD,
          "Zoe",
          "Doe",
          true,
          null,
          null,
          person.contactInformation.emailAddress.address,
          person.contactInformation.primaryTelephone.number,
          person.contactInformation.secondaryTelephone.number,
          person.contactInformation.postalAddress.streetAddress,
          person.contactInformation.postalAddress.city,
          person.contactInformation.postalAddress.stateProvince,
          person.contactInformation.postalAddress.postalCode,
          person.contactInformation.postalAddress.countryCode));

    if ((idx % 2) == 0) {
      let event = {
        tenantId: user.tenantId,
        username: user.username,
        name: user.person.name,
        occurredOn: new Date(),
        eventVersion: 1
      }

      ApplicationServiceRegistry
        .notificationApplicationService.eventStore.append("PersonNameChanged", event);
    }

    if ((idx % 3) == 0) {
      let event = {
        tenantId: user.tenantId,
        username: user.username,
        occurredOn: new Date(),
        eventVersion: 1
      }

      ApplicationServiceRegistry
        .notificationApplicationService.eventStore.append("UserPasswordChanged", event)
    }

    DomainEventPublisher.reset();
  }
}
