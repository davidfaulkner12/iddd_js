const chai = require("chai")
const should = chai.should()

//const Enablement = require("../../../domain/identity/Enablement")

const DomainRegistry = require("../../../domain/DomainRegistry")

const fixture = require("../IdentityAccessFixtures")

describe("AuthorizationService", function() {

  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("UserInRoleAuthorization", function() {

    let tenant = fixture.tenantAggregate();
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);
    let managerRole = tenant.provisionRole("Manager", "A manager role.", true);

    managerRole.assignUser(user);

    DomainRegistry
      .roleRepository
      .add(managerRole);

    let authorized =
      DomainRegistry
      .authorizationService
      .isUserInRole(user, "Manager");

    authorized.should.be.true

    authorized =
      DomainRegistry
      .authorizationService
      .isUserInRole(user, "Director");

    authorized.should.be.false
  })

  it("UsernameInRoleAuthorization", function() {

    let tenant = fixture.tenantAggregate();
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);
    let managerRole = tenant.provisionRole("Manager", "A manager role.", true);

    managerRole.assignUser(user);

    DomainRegistry
      .roleRepository
      .add(managerRole);

    let authorized =
      DomainRegistry
      .authorizationService
      .isUserInRoleByUsername(tenant.tenantId, user.username, "Manager");

    authorized.should.be.true

    authorized =
      DomainRegistry
      .authorizationService
      .isUserInRole(tenant.tenantId, user.username, "Director");

    authorized.should.be.false
  })
})
