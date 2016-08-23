/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

require("chai").should()
const rest = require("restling")

const DomainRegistry = require("../../domain/DomainRegistry")
const groupRoutes = require("../../resource/GroupRoutes")

const resourceFixture = require("./ResourceFixture")
const fixture = require("../domain/IdentityAccessFixtures")

describe("GroupResource", function() {
  before(function(done) {
    resourceFixture.startWithRoutes(groupRoutes, done)
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

  it("Should get group", function(done) {
    let group = fixture.group1Aggregate()
    DomainRegistry.groupRepository.add(group)

    let tenantId = group.tenantId.id
    let groupName = group.name

    let url =
      `${resourceFixture.baseUrl}/tenants/${encodeURIComponent(tenantId)}/groups/${encodeURIComponent(groupName)}`

    console.log(">>> GET: " + url)

    rest.get(url)
      .then((response) => {
        tenantId.should.equal(response.data.tenantId.id)
        groupName.should.equal(response.data.name)
      }).then(done, (err) => done(err))
  })
})
