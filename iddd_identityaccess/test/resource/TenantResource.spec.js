/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

require("chai").should()
const rest = require("restling")

const tenantRoutes = require("../../resource/TenantRoutes")

const resourceFixture = require("./ResourceFixture")
const fixture = require("../domain/IdentityAccessFixtures")

describe("TenantResource", function() {
  before(function(done) {
    resourceFixture.startWithRoutes(tenantRoutes, done)
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

  it("Should get tenant", function(done) {
    let tenant = fixture.tenantAggregate()

    let tenantId = tenant.tenantId.id

    let url =
      `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}`

    console.log(">>> GET: " + url)

    rest.get(url)
      .then((response) => {
        console.log(response.data)
        tenantId.should.equal(response.data.tenantId.id)
      }).then(done, (err) => done(err))
  })
})
