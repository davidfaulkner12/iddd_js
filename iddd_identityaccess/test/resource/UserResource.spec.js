/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

require("chai").should()
const rest = require("restling")

const DomainRegistry = require("../../domain/DomainRegistry")
const userRoutes = require("../../resource/UserRoutes")

const resourceFixture = require("./ResourceFixture")
const fixture = require("../domain/IdentityAccessFixtures")

describe("GroupResource", function() {
  before(function(done) {
    resourceFixture.startWithRoutes(userRoutes, done)
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

  it("GetAuthenticUser", function(done) {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let tenantId = user.tenantId.id
    let username = user.username
    let password = fixture.PASSWORD

    let url =
      `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(username)}/authenticatedWith/${encodeURIComponent(password)}`
    console.log(">>> GET:", url)

    rest.get(url)
      .then((response) => {
        console.log(response.data)
        tenantId.should.equal(response.data.tenantId.id)
        user.username.should.equal(response.data.username)
        user.person.emailAddress.address.should.equal(response.data.emailAddress)
      }).then(done, (err) => done(err))
  })

  it("GetAuthenticUserWrongPassword", function(done) {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let tenantId = user.tenantId.id
    let username = user.username
    let password = "foobar"

    let url =
      `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(username)}/authenticatedWith/${encodeURIComponent(password)}`
    console.log(">>> GET:", url)

    rest.get(url)
      .then(
        (nonErrorReponse) => {
          throw new Error("Should never get here")
        },
        (errorResponse) => {
          console.log("Inside error response", errorResponse.statusCode)
          errorResponse.statusCode.should.equal(404)
        })
      .then(done, (err) => done(err))
  })

  it("GetUser", function(done) {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let tenantId = user.tenantId.id
    let username = user.username

    let url =
      `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(username)}`
    console.log(">>> GET:", url)

    rest.get(url)
      .then((response) => {
        console.log(response.data)
        response.response.statusCode.should.equal(200)
        user.username.should.equal(response.data.username)
        response.data.enabled.should.be.true
      }).then(done, (err) => done(err))
  })

  it("GetNonExistingUser", function(done) {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let tenantId = user.tenantId.id
    let username = "bobdole"

    let url = `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(username)}`
    console.log(">>> GET:", url)

    rest.get(url)
      .then(
        (nonErrorReponse) => {
          throw new Error("Should never get here")
        },
        (errorResponse) => {
          console.log("Inside error response", errorResponse.statusCode)
          errorResponse.statusCode.should.equal(404)
        })
      .then(done, (err) => done(err))
  })

  it("IsUserInRole", function(done) {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let tenantId = user.tenantId.id
    let username = user.username

    let role = fixture.roleAggregate()
    role.assignUser(user)
    DomainRegistry.roleRepository.add(role)

    let roleName = role.name

    let url = `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(username)}/inRole/${encodeURIComponent(roleName)}`
    console.log(">>> GET:", url)

    rest.get(url)
      .then((response) => {
        console.log(response.data)
        response.response.statusCode.should.equal(200)
        user.username.should.equal(response.data.username)
        role.name.should.equal(response.data.role)
      }).then(done, (err) => done(err))
  })

  it("IsUserNotInRole", function(done) {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let tenantId = user.tenantId.id
    let username = user.username

    let role = fixture.roleAggregate()
    DomainRegistry.roleRepository.add(role)

    let roleName = role.name

    let url = `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(username)}/inRole/${encodeURIComponent(roleName)}`
    console.log(">>> GET:", url)

    rest.get(url)
      .then((response) => {
        console.log(response.data)
        response.response.statusCode.should.equal(204)
      }).then(done, (err) => done(err))
  })
})
