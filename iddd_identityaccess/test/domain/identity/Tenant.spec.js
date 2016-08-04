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
  FullName
} = require("../../../domain/identity/IdentityValueObjects")

const fixture = require("../IdentityAccessFixtures")

describe("Tenant", function() {
  it("Should provision from the service", function(done) {

    let p1 = new Promise(
      (resolve, reject) => {
        DomainEventPublisher.subscribe("TenantProvisioned", (evt) => {
            resolve()
          })
      }
    )

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

    Promise.all([p1, p2]).then(() => { done() })
  })
})
