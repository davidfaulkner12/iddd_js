/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

let should = require("chai").should()

const fixture = require("../IdentityAccessFixtures")
const DomainRegistry = require("../../../domain/DomainRegistry")
const DomainEventPublisher =
  require("../../../common/domain/DomainEventPublisher")
const Group = require("../../../domain/identity/Group")

describe("Group", function() {
  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("ProvisionGroup", function() {
    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)
    DomainRegistry.groupRepository.allGroups(tenant.tenantId)
      .length.should.equal(1)
  })

  it("AddGroup", function(done) {
    let promise = new Promise((resolve) => {
      DomainEventPublisher.subscribe("GroupGroupAdded", (evt) => {
        resolve()
      })
    })

    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)

    let groupB = tenant.provisionGroup("GroupB", "A group named GroupB")
    DomainRegistry.groupRepository.add(groupB)
    groupA.addGroup(groupB, DomainRegistry.groupMemberService)

    groupA.groupMembers.length.should.equal(1)
    groupB.groupMembers.length.should.equal(0)
    promise.then(() => {
      done()
    })
  })

  it("AddUser", function(done) {
    let promise = new Promise((resolve) => {
      DomainEventPublisher.subscribe("GroupUserAdded", (evt) => {
        resolve()
      })
    })

    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)
    groupA.addUser(user)
    DomainRegistry.groupRepository.add(groupA)

    groupA.groupMembers.length.should.equal(1)

    groupA.isMember(user, DomainRegistry.groupMemberService).should.be.true

    promise.then(() => {
      done()
    })
  })

  it("RemoveGroup", function(done) {
    let promise = new Promise((resolve) => {
      DomainEventPublisher.subscribe("GroupGroupRemoved", (evt) => {
        resolve()
      })
    })

    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)
    let groupB = tenant.provisionGroup("GroupB", "A group named GroupB")
    DomainRegistry.groupRepository.add(groupB)
    groupA.addGroup(groupB, DomainRegistry.groupMemberService)

    groupA.groupMembers.length.should.equal(1)
    groupA.removeGroup(groupB)
    groupA.groupMembers.length.should.equal(0)

    promise.then(() => {
      done()
    })
  })

  it("RemoveUser", function(done) {
    let promise = new Promise((resolve) => {
      DomainEventPublisher.subscribe("GroupUserRemoved", (evt) => {
        resolve()
      })
    })

    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)
    groupA.addUser(user)
    DomainRegistry.groupRepository.add(groupA)

    groupA.groupMembers.length.should.equal(1)
    groupA.removeUser(user)
    groupA.groupMembers.length.should.equal(0)
    promise.then(() => {
      done()
    })
  })

  it("RemoveGroupReferencedUser", function() {
    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)
    groupA.addUser(user)
    DomainRegistry.groupRepository.add(groupA)

    groupA.groupMembers.length.should.equal(1)
    groupA.isMember(user, DomainRegistry.groupMemberService).should.be.true

    DomainRegistry.userRepository.remove(user)

    let reGrouped =
      DomainRegistry
      .groupRepository
      .groupNamed(tenant.tenantId, "GroupA")
    reGrouped.name.should.equal("GroupA")
    reGrouped.groupMembers.length.should.equal(1)
    reGrouped.isMember(user, DomainRegistry.groupMemberService).should.be.false
  })

  it("RepositoryRemoveGroup", function() {
    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)
    let notNullGroup =
      DomainRegistry
      .groupRepository
      .groupNamed(tenant.tenantId, "GroupA")
    should.exist(notNullGroup)

    DomainRegistry.groupRepository.remove(groupA)

    let nullGroup =
      DomainRegistry
      .groupRepository
      .groupNamed(tenant.tenantId, "GroupA")
    should.not.exist(nullGroup)
  })

  it("UserIsMemberOfNestedGroup", function(done) {
    let promise = new Promise((resolve) => {
      DomainEventPublisher.subscribe("GroupGroupAdded", (evt) => {
        resolve()
      })
    })

    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)
    let groupB = tenant.provisionGroup("GroupB", "A group named GroupB")
    DomainRegistry.groupRepository.add(groupB)
    groupA.addGroup(groupB, DomainRegistry.groupMemberService)
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)
    groupB.addUser(user)

    groupB.isMember(user, DomainRegistry.groupMemberService).should.be.true
    groupA.isMember(user, DomainRegistry.groupMemberService).should.be.true

    promise.then(() => {
      done()
    })
  })

  it("UserIsNotMember", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)
    // tests alternate creation via constructor
    let groupA = new Group(user.tenantId, "GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)
    let groupB = new Group(user.tenantId, "GroupB", "A group named GroupB")
    DomainRegistry.groupRepository.add(groupB)
    groupA.addGroup(groupB, DomainRegistry.groupMemberService)

    groupB.isMember(user, DomainRegistry.groupMemberService).should.be.false
    groupA.isMember(user, DomainRegistry.groupMemberService).should.be.false
  })

  it("NoRecursiveGroupings", function(done) {
    let groupGroupAddedCount = 0

    let promise = new Promise((resolve) => {
      DomainEventPublisher.subscribe("GroupGroupAdded", (evt) => {
        if (++groupGroupAddedCount === 2) {
          resolve(++groupGroupAddedCount)
        }
      })
    })

    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)
    // tests alternate creation via constructor
    let groupA = new Group(user.tenantId, "GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)
    let groupB = new Group(user.tenantId, "GroupB", "A group named GroupB")
    DomainRegistry.groupRepository.add(groupB)
    let groupC = new Group(user.tenantId, "GroupC", "A group named GroupC")
    DomainRegistry.groupRepository.add(groupC)
    groupA.addGroup(groupB, DomainRegistry.groupMemberService)
    groupB.addGroup(groupC, DomainRegistry.groupMemberService)

    let failed = false

    try {
      groupC.addGroup(groupA, DomainRegistry.groupMemberService)
    } catch (err) {
      failed = true
    }
    failed.should.be.true

    promise.then(() => {
      done()
    })
  })

  it("NoRoleInternalGroupsInFindAllGroups", function() {
    let tenant = fixture.tenantAggregate()
    let groupA = tenant.provisionGroup("GroupA", "A group named GroupA")
    DomainRegistry.groupRepository.add(groupA)

    let roleA = tenant.provisionRole("RoleA", "A role of A.")
    DomainRegistry.roleRepository.add(roleA)
    let roleB = tenant.provisionRole("RoleB", "A role of B.")
    DomainRegistry.roleRepository.add(roleB)
    let roleC = tenant.provisionRole("RoleC", "A role of C.")
    DomainRegistry.roleRepository.add(roleC)

    let groups =
      DomainRegistry
      .groupRepository
      .allGroups(tenant.tenantId)

    groups.length.should.equal(1)
  })
})
