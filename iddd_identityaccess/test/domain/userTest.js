var chai = require("chai")
var should = chai.should()

let User = require("../../domain/user.js")

describe("User", function() {
  it ("Should construct", function() {
    let myUser = new User("test")
    myUser.name.should.equal("test")
  })

  it ("Should be enabled", function() {
    // TODO!
    let user = fixtureUser()

    assertTrue(user.enabled);
  })

  it ("Should allow a user to disabled", function(done) {
    let user = fixtureUser()

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done()
    })

    user.defineEnablement(new Enablement(false, null, null))

    user.enabled.should.be.false
  })

  it ("Should allow a user to be disabled with start and end dates", function(done) {
    let user = fixtureUser()

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done()
    })

    user.defineEnablement(new Enablement(false, this.today(), this.tomorrow()))

    user.enabled.should.be.false
  })

  it ("Should allow a user to be disabled with outside start and end dates", function(done) {
    let user = fixtureUser()

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done()
    })

    user.defineEnablement(new Enablement(false, this.dayBeforeYesterday(), this.yesterday()))

    user.enabled.should.be.false
  })

  it ("Should not allow enablement with unsequenced dates", function(done) {
    let user = fixtureUser()

    let failure = false

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done(new Error("Should never have gotten here"))
    })

    try {
      user.defineEnablement(new Enablement(false, this.dayBeforeYesterday(), this.yesterday()))
    } catch (err) {
      /// Good!
      failure = true
    }

    user.enabled.should.be.true
    failure.should.be.true
  })

  it("Should have a user descriptor", function() {
    let user = fixtureUser()
    let userDescriptor = user.userDescriptor

    should.exist(userDesciptor.emailAddress)
    userDescriptor.emailAddress.should.equal(FIXTURE_USER_EMAIL_ADDRESS)

    should.exist(userDescriptor.tenantId)
    userDescriptor.tenantId.should.equal(user.tenantId)

    should.exist(userDescriptor.username)
    userDescriptor.username.should.equal(FIXTURE_USERNAME)
  })

  it("Should allow a user to change their password", function(done) {
    let user = fixtureUser()

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      aDomainEvent.tenantId.should.equal(user.tenantId)
      done()
    })

    user.changePassword(FIXTURE_PASSWORD, "ThisIsANewPassword")
  })

  it("Should fail if a user doesn't know their password", function() {
    let user = fixtureUser()

    try {
      user.changePassword("no clue", "ThisIsANewPassword")
    } catch (err) {
      // Should do nothing
    }
  })

  it("Should hash user password on construction", function() {
    let user = fixtureUser()

    FIXTURE_PASSWORD.should.not.equal(user.password())
  })

  it("Should hash password on change", function() {
    let user = fixtureUser()

    // TODO String strongPassword = DomainRegistry.passwordService().generateStrongPassword();
    //   user.changePassword(FIXTURE_PASSWORD, strongPassword);

    user.changePassword(FIXTURE_PASSWORD, "ThisIsANewPassword")

    FIXTURE_PASSWORD.should.not.equal(user.password)
    // assertFalse(strongPassword.equals(user.password()));
    "ThisIsANewPassword".should.not.equal(user.password)

  })

  it("Should allow user personal contact information to change", function(done) {
    let user = fixtureUser()

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      done()
    })

    user.changePersonalContactInformation(
            new ContactInformation(
                new EmailAddress(FIXTURE_USER_EMAIL_ADDRESS2),
                new PostalAddress(
                        "123 Mockingbird Lane",
                        "Boulder",
                        "CO",
                        "80301",
                        "US"),
                new Telephone("303-555-1210"),
                new Telephone("303-555-1212")))

    new EmailAddress(FIXTURE_USER_EMAIL_ADDRESS2).should.equal(user.person.emailAddress)
    "123 Mockingbird Lane".should.equal(user.person.contactInformation.postalAddress.streetAddress)
  })

  it("Should allow for a name change", function(done) {
    let user = fixtureUser()

    DomainEventPublisher.subscribe(/*...*/null, (aDomainEvent) => {
      aDomainEvent.username.should.equal(user.username)
      aDomainEvent.name.firstName.should.equal("Joe")
      aDomainEvent.name.lastName.should.equal("Smith")
      done()
    })

    user.changePersonalName(new FullName("Joe", "Smith"))
  })

})
