const chai = require("chai")
const should = chai.should()

const DomainRegistry = require("../../domain/DomainRegistry")
const ApplicationServiceRegistry = require("../../application/ApplicationServiceRegistry")

// TODO Maybe this doesn't work anymore?
const fixture = require("../domain/IdentityAccessFixtures")

const {
  AssignUserToRoleCommand
} = require("../../application/command/Commands")

describe("AccessApplicationService", function() {

  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("AssignUserToRole", function() {
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);

    let role = fixture.roleAggregate();
    DomainRegistry.roleRepository.add(role);

    role.isInRole(user, DomainRegistry.groupMemberService).should.be.false

    ApplicationServiceRegistry
      .accessApplicationService
      .assignUserToRole(
        new AssignUserToRoleCommand(
          user.tenantId.id,
          user.username,
          role.name));

    role.isInRole(user, DomainRegistry.groupMemberService).should.be.true
  })

  it("IsUserInRole", function() {
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);

    let role = fixture.roleAggregate();
    DomainRegistry.roleRepository.add(role);

    ApplicationServiceRegistry
      .accessApplicationService
      .isUserInRole(
        user.tenantId.id,
        user.username,
        role.name).should.be.false

    ApplicationServiceRegistry
      .accessApplicationService
      .assignUserToRole(
        new AssignUserToRoleCommand(
          user.tenantId.id,
          user.username,
          role.name));

    ApplicationServiceRegistry
      .accessApplicationService
      .isUserInRole(
        user.tenantId.id,
        user.username,
        role.name).should.be.true
  })

  it("UserInRole", function() {
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);

    let role = fixture.roleAggregate();
    DomainRegistry.roleRepository.add(role);


    let userNotInRole =
      ApplicationServiceRegistry
      .accessApplicationService
      .userInRole(user.tenantId.id, user.username, role.name);

    should.not.exist(userNotInRole)

    ApplicationServiceRegistry
      .accessApplicationService
      .assignUserToRole(
        new AssignUserToRoleCommand(
          user.tenantId.id,
          user.username,
          role.name));

    let userInRole =
      ApplicationServiceRegistry
      .accessApplicationService
      .userInRole(user.tenantId.id, user.username, role.name);

    should.exist(userInRole);
  })


})
