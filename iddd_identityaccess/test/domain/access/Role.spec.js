const chai = require("chai")
const should = chai.should()

//const Enablement = require("../../../domain/identity/Enablement")

const DomainEventPublisher = require("../../../common/domain/DomainEventPublisher")

const DomainRegistry = require("../../../domain/DomainRegistry")
const Group = require("../../../domain/identity/Group")
const Role = require("../../../domain/access/Role")

const fixture = require("../IdentityAccessFixtures")

describe("Role", function() {

  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("ProvisionRole", function() {
    let tenant = fixture.tenantAggregate();
    let role = tenant.provisionRole("Manager", "A manager role.");
    DomainRegistry.roleRepository.add(role);
    DomainRegistry.roleRepository.allRoles(tenant.tenantId).length.should.equal(1)
  })

  it("RoleUniqueness", function() {
    let tenant = fixture.tenantAggregate();
    let role1 = tenant.provisionRole("Manager", "A manager role.");
    DomainRegistry.roleRepository.add(role1);

    let nonUnique = false;

    try {
      let role2 = tenant.provisionRole("Manager", "A manager role.");
      DomainRegistry.roleRepository.add(role2);

      fail("Should have thrown exception for nonuniqueness.");

    } catch (err) {
      nonUnique = true;
    }

    nonUnique.should.be.true
  })

  it("UserIsInRole", function() {
    let tenant = fixture.tenantAggregate();
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);
    let managerRole = tenant.provisionRole("Manager", "A manager role.", true);
    let group = new Group(user.tenantId, "Managers", "A group of managers.");
    DomainRegistry.groupRepository.add(group);
    managerRole.assignGroup(group, DomainRegistry.groupMemberService);
    DomainRegistry.roleRepository.add(managerRole);
    group.addUser(user);

    group.isMember(user, DomainRegistry.groupMemberService).should.be.true
    managerRole.isInRole(user, DomainRegistry.groupMemberService).should.be.true
  })

  it("UserIsNotInRole", function() {
    let tenant = fixture.tenantAggregate();
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);
    let managerRole = tenant.provisionRole("Manager", "A manager role.", true);
    let group = tenant.provisionGroup("Managers", "A group of managers.");
    DomainRegistry.groupRepository.add(group);
    managerRole.assignGroup(group, DomainRegistry.groupMemberService);
    DomainRegistry.roleRepository.add(managerRole);
    let accountantRole = new Role(user.tenantId, "Accountant", "An accountant role.");
    DomainRegistry.roleRepository.add(accountantRole);

    managerRole.isInRole(user, DomainRegistry.groupMemberService).should.be.false
    accountantRole.isInRole(user, DomainRegistry.groupMemberService).should.be.false
  })

  it("NoRoleInternalGroupsInFindGroupByName", function(done) {
    let tenant = fixture.tenantAggregate();
    let roleA = tenant.provisionRole("RoleA", "A role of A.");
    DomainRegistry.roleRepository.add(roleA);

    let error = false;

    try {

      DomainRegistry
        .groupRepository()
        .groupNamed(
          tenant.tenantId,
          roleA.group().name());

      done("Should have thrown exception for invalid group name.");

    } catch (err) {
      error = true;
    }

    error.should.be.true
    done()
  })

  it("InternalGroupAddedEventsNotPublished", function() {

    let roleSomethingAssignedCount = 0
    let groupSomethingAddedCount = 0

    // TODO Much harder to handle with promises here

    DomainEventPublisher.subscribe("GroupAssignedToRole", (evt) => {
      ++roleSomethingAssignedCount
    })

    DomainEventPublisher.subscribe("GroupGroupAdded", (evt) => {
      ++groupSomethingAddedCount
    })

    DomainEventPublisher.subscribe("UserAssignedToRole", (evt) => {
      ++roleSomethingAssignedCount
    })

    DomainEventPublisher.subscribe("GroupUserAdded", (evt) => {
      ++groupSomethingAddedCount
    })

    let tenant = fixture.tenantAggregate();
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);
    let managerRole = tenant.provisionRole("Manager", "A manager role.", true);
    let group = new Group(user.tenantId, "Managers", "A group of managers.");
    DomainRegistry.groupRepository.add(group);
    managerRole.assignGroup(group, DomainRegistry.groupMemberService);
    managerRole.assignUser(user);
    DomainRegistry.roleRepository.add(managerRole);
    group.addUser(user); // legal add

    roleSomethingAssignedCount.should.equal(2)
    groupSomethingAddedCount.should.equal(1)
  })

  it("InternalGroupRemovedEventsNotPublished", function() {

    let roleSomethingUnassignedCount = 0
    let groupSomethingRemovedCount = 0

    // TODO Much harder to handle with promises here

    DomainEventPublisher.subscribe("GroupUnassignedFromRole", (evt) => {
      ++roleSomethingUnassignedCount
    })

    DomainEventPublisher.subscribe("GroupGroupRemoved", (evt) => {
      ++groupSomethingRemovedCount
    })

    DomainEventPublisher.subscribe("UserUnassignedFromRole", (evt) => {
      ++roleSomethingUnassignedCount
    })

    DomainEventPublisher.subscribe("GroupUserRemoved", (evt) => {
      ++groupSomethingRemovedCount
    })

    let tenant = fixture.tenantAggregate();
    let user = fixture.userAggregate();
    DomainRegistry.userRepository.add(user);
    let managerRole = tenant.provisionRole("Manager", "A manager role.", true);
    let group = new Group(user.tenantId, "Managers", "A group of managers.");
    DomainRegistry.groupRepository.add(group);
    managerRole.assignUser(user);
    managerRole.assignGroup(group, DomainRegistry.groupMemberService);
    DomainRegistry.roleRepository.add(managerRole);

    managerRole.unassignUser(user);
    managerRole.unassignGroup(group);

    roleSomethingUnassignedCount.should.equal(2)
    groupSomethingRemovedCount.should.equal(0)
  })
})
