const chai = require("chai")
const should = chai.should()

const DomainRegistry = require("../../../domain/DomainRegistry")

const fixture = require("../IdentityAccessFixtures")

describe("GroupRepository", function() {

  beforeEach(function() {
    DomainRegistry.groupRepository.clean()
  })

  afterEach(function() {
    DomainRegistry.groupRepository.clean()
  })

  it("RemoveGroupReferencedUser", function() {
      let tenant = fixture.tenantAggregate();
      let groupA = tenant.provisionGroup("GroupA", "A group named GroupA");
      let user = fixture.userAggregate();
      DomainRegistry.userRepository.add(user);
      groupA.addUser(user);
      DomainRegistry.groupRepository.add(groupA);

      groupA.groupMembers.length.should.equal(1)
      groupA.isMember(user, DomainRegistry.groupMemberService).should.be.true
      DomainRegistry.userRepository.remove(user);

      let reGrouped =
          DomainRegistry
              .groupRepository
              .groupNamed(tenant.tenantId, "GroupA");
      "GroupA".should.equal(reGrouped.name)
      reGrouped.groupMembers.length.should.equal(1)
      reGrouped.isMember(user, DomainRegistry.groupMemberService).should.be.false
  })

  it("RepositoryRemoveGroup", function() {
      let tenant = fixture.tenantAggregate();
      let groupA = tenant.provisionGroup("GroupA", "A group named GroupA");
      DomainRegistry.groupRepository.add(groupA);
      let notNullGroup =
          DomainRegistry
              .groupRepository
              .groupNamed(tenant.tenantId, "GroupA");
      should.exist(notNullGroup)
      DomainRegistry.groupRepository.remove(groupA);
      let nullGroup =
          DomainRegistry
              .groupRepository
              .groupNamed(tenant.tenantId, "GroupA");
      should.not.exist(nullGroup)
  })
})
