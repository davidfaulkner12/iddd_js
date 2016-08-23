/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
const should = chai.should()

const DomainRegistry = require("../../../domain/DomainRegistry")

const fixture = require("../IdentityAccessFixtures")

describe("AuthenticationService", function() {
  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("AuthenticationSuccess", function() {
    let user = fixture.userAggregate()

    DomainRegistry
      .userRepository
      .add(user)

    let userDescriptor =
      DomainRegistry
      .authenticationService
      .authenticate(
        user.tenantId,
        user.username,
        fixture.PASSWORD)

    should.exist(userDescriptor)
    userDescriptor.nullDescriptor.should.be.false
    userDescriptor.tenantId.should.equal(user.tenantId)
    userDescriptor.username.should.equal(user.username)
    userDescriptor.emailAddress.should.equal(user.person.emailAddress.address)
  })

  it("AuthenticationTenantFailure", function() {
    let user = fixture.userAggregate()

    DomainRegistry
      .userRepository
      .add(user)

    let userDescriptor =
      DomainRegistry
      .authenticationService
      .authenticate(
        DomainRegistry.tenantRepository.nextIdentity(),
        user.username,
        fixture.PASSWORD)

    should.exist(userDescriptor)
    userDescriptor.nullDescriptor.should.be.true
  })

  it("AuthenticationUsernameFailure", function() {
    let user = fixture.userAggregate()

    DomainRegistry
      .userRepository
      .add(user)

    let userDescriptor =
      DomainRegistry
      .authenticationService
      .authenticate(
        user.tenantId,
        fixture.USERNAME2,
        user._password)

    should.exist(userDescriptor)
    userDescriptor.nullDescriptor.should.be.true
  })

  it("AuthenticationPasswordFailure", function() {
    let user = fixture.userAggregate()

    DomainRegistry
      .userRepository
      .add(user)

    let userDescriptor =
      DomainRegistry
      .authenticationService
      .authenticate(
        user.tenantId,
        user.username,
        fixture.PASSWORD + "-")

    should.exist(userDescriptor)
    userDescriptor.nullDescriptor.should.be.true
  })
})
