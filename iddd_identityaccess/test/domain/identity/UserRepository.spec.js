/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
const should = chai.should()

const DomainRegistry = require("../../../domain/DomainRegistry")

const fixture = require("../IdentityAccessFixtures")

describe("UserRepository", function() {
  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("AddUser", function() {
    let user = fixture.userAggregate()

    DomainRegistry.userRepository.add(user)

    should.exist(DomainRegistry
      .userRepository
      .userWithUsername(user.tenantId, user.username))
  })

  it("FindUserByUsername", function() {
    let user = fixture.userAggregate()

    DomainRegistry.userRepository.add(user)

    should.exist(DomainRegistry
      .userRepository
      .userWithUsername(user.tenantId, user.username))
  })

  it("RemoveUser", function() {
    let user = fixture.userAggregate()

    DomainRegistry.userRepository.add(user)

    should.exist(DomainRegistry
      .userRepository
      .userWithUsername(user.tenantId, user.username))

    DomainRegistry.userRepository.remove(user)

    should.not.exist(DomainRegistry
      .userRepository
      .userWithUsername(user.tenantId, user.username))
  })

  it("FindSimilarlyNamedUsers", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let user2 = fixture.userAggregate2()
    DomainRegistry.userRepository.add(user2)

    let name = user.person.name

    let users =
      DomainRegistry
      .userRepository
      .allSimilarlyNamedUsers(
        user.tenantId,
        "",
        name.lastName.substring(0, 2))

    users.length.should.equal(2)
  })
})
