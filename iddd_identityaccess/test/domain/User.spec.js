/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
const should = chai.should()

const _ = require("underscore")

const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")

const {
  Enablement,
  ContactInformation,
  FullName,
  EmailAddress,
  PostalAddress,
  Telephone
} = require("../../domain/identity/IdentityValueObjects")

const fixture = require("./IdentityAccessFixtures")

describe("User", function() {
  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("Should be enabled", function() {
    let user = fixture.userAggregate()

    user.enabled.should.be.true
  })

  it("Should allow a user to disabled", function(done) {
    let user = fixture.userAggregate()

    DomainEventPublisher.subscribe("UserEnablementChanged", (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done()
    })

    user.defineEnablement(new Enablement(false, null, null))

    user.enabled.should.be.false
  })

  it("Should allow a user to be disabled with start and end dates",
    function(done) {
      let user = fixture.userAggregate()

      DomainEventPublisher.subscribe("UserEnablementChanged",
      (aDomainEvent) => {
        aDomainEvent.username.should.equal(user.username)
        done()
      }
    )

      user.defineEnablement(
        new Enablement(false, fixture.today(), fixture.tomorrow()))

      user.enabled.should.be.false
    }
  )

  it("Should allow a user to be disabled with outside start and end dates",
    function(done) {
      let user = fixture.userAggregate()

      DomainEventPublisher.subscribe("UserEnablementChanged",
      (aDomainEvent) => {
        aDomainEvent.username.should.equal(user.username)
        done()
      })

      user.defineEnablement(
        new Enablement(false,
          fixture.dayBeforeYesterday(),
          fixture.yesterday()))

      user.enabled.should.be.false
    }
  )

  it("Should not allow enablement with unsequenced dates", function(done) {
    let user = fixture.userAggregate()

    let failure = false

    DomainEventPublisher.subscribe("UserEnablementChanged", (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done(new Error("Should never have gotten here"))
    })

    try {
      user.defineEnablement(
        new Enablement(false,
          fixture.yesterday(),
          fixture.dayBeforeYesterday()))
    } catch (err) {
      // Good!
      failure = true
    }

    user.enabled.should.be.true
    failure.should.be.true
    done()
  })

  it("Should have a user descriptor", function() {
    let user = fixture.userAggregate()
    let userDescriptor = user.userDescriptor

    should.exist(userDescriptor.emailAddress)
    userDescriptor.emailAddress.should.equal(fixture.USER_EMAIL_ADDRESS)

    should.exist(userDescriptor.tenantId)
    userDescriptor.tenantId.should.equal(user.tenantId)

    should.exist(userDescriptor.username)
    userDescriptor.username.should.equal(fixture.USERNAME)
  })

  it("Should allow a user to change their password", function(done) {
    let user = fixture.userAggregate()

    DomainEventPublisher.subscribe("UserPasswordChanged", (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      aDomainEvent.tenantId.should.equal(user.tenantId)
      done()
    })

    user.changePassword(fixture.PASSWORD, "ThisIsANewPassword")
  })

  it("Should fail if a user doesn't know their password", function() {
    let user = fixture.userAggregate()

    try {
      user.changePassword("no clue", "ThisIsANewPassword")
    } catch (err) {
      // Should do nothing
    }
  })

  it("Should hash user password on construction", function() {
    let user = fixture.userAggregate()

    fixture.PASSWORD.should.not.equal(
      user.internalAccessOnlyEncryptedPassword())
  })

  it("Should hash password on change", function() {
    let user = fixture.userAggregate()

    user.changePassword(fixture.PASSWORD, "ThisIsANewPassword")

    fixture.PASSWORD.should.not.equal(
      user.internalAccessOnlyEncryptedPassword())
    "ThisIsANewPassword".should.not.equal(
      user.internalAccessOnlyEncryptedPassword())
  })

  it("Should allow user personal contact information to change",
    function(done) {
      let user = fixture.userAggregate()

      DomainEventPublisher.subscribe("PersonContactInformationChanged",
      (aDomainEvent) => {
        aDomainEvent.username.should.equal(user.username)
        done()
      })

      user.changePersonalContactInformation(
        new ContactInformation(
          new EmailAddress(fixture.USER_EMAIL_ADDRESS2),
          new PostalAddress(
            "123 Mockingbird Lane",
            "Boulder",
            "CO",
            "80301",
            "US"),
          new Telephone("303-555-1210"),
          new Telephone("303-555-1212")))

      _.isEqual(new EmailAddress(fixture.USER_EMAIL_ADDRESS2),
        user.person.emailAddress)
        .should.be.true
      "123 Mockingbird Lane".should.equal(
        user.person.contactInformation.postalAddress.streetAddress)
    }
  )

  it("Should allow for a name change", function(done) {
    let user = fixture.userAggregate()

    DomainEventPublisher.subscribe("PersonNameChanged", (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      aDomainEvent.name.firstName.should.equal("Joe")
      aDomainEvent.name.lastName.should.equal("Smith")
      done()
    })

    user.changePersonalName(new FullName("Joe", "Smith"))
  })
})
