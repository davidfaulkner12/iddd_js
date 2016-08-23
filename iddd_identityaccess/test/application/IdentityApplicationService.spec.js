/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
const should = chai.should()

const _ = require("underscore")

const {
  ActivateTenantCommand,
  AddGroupToGroupCommand,
  AddUserToGroupCommand,
  AuthenticateUserCommand,
  ChangeContactInfoCommand,
  ChangeEmailAddressCommand,
  ChangePostalAddressCommand,
  ChangePrimaryTelephoneCommand,
  ChangeSecondaryTelephoneCommand,
  ChangeUserPasswordCommand,
  ChangeUserPersonalNameCommand,
  DeactivateTenantCommand,
  DefineUserEnablementCommand,
  RemoveGroupFromGroupCommand,
  RemoveUserFromGroupCommand
} = require("../../application/command/Commands")

const DomainRegistry = require("../../domain/DomainRegistry")
const ApplicationServiceRegistry =
  require("../../application/ApplicationServiceRegistry")

const fixture = require("../domain/IdentityAccessFixtures")

describe("IdentityApplicationServiceTest", function() {
  beforeEach(function() {
    fixture.clean()
  })

  afterEach(function() {
    fixture.clean()
  })

  it("ActivateTenant", function() {
    let tenant = fixture.tenantAggregate()
    tenant.deactivate()
    tenant.active.should.be.false

    ApplicationServiceRegistry
      .identityApplicationService
      .activateTenant(new ActivateTenantCommand(tenant.tenantId.id))

    let changedTenant =
      DomainRegistry.tenantRepository.tenantOfId(tenant.tenantId)

    should.exist(changedTenant)
    changedTenant.name.should.equal(tenant.name)
    changedTenant.active.should.be.true
  })

  it("AddGroupToGroup", function() {
    let parentGroup = fixture.group1Aggregate()
    DomainRegistry.groupRepository.add(parentGroup)

    let childGroup = fixture.group2Aggregate()
    DomainRegistry.groupRepository.add(childGroup)

    parentGroup.groupMembers.length.should.equal(0)

    ApplicationServiceRegistry
      .identityApplicationService
      .addGroupToGroup(new AddGroupToGroupCommand(
        parentGroup.tenantId.id,
        parentGroup.name,
        childGroup.name))

    parentGroup.groupMembers.length.should.equal(1)
  })

  it("AddUserToGroup", function() {
    let parentGroup = fixture.group1Aggregate()
    DomainRegistry.groupRepository.add(parentGroup)

    let childGroup = fixture.group2Aggregate()
    DomainRegistry.groupRepository.add(childGroup)

    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    parentGroup.groupMembers.length.should.equal(0)
    childGroup.groupMembers.length.should.equal(0)

    parentGroup.addGroup(childGroup, DomainRegistry.groupMemberService)

    ApplicationServiceRegistry
      .identityApplicationService
      .addUserToGroup(new AddUserToGroupCommand(
        childGroup.tenantId.id,
        childGroup.name,
        user.username))

    parentGroup.groupMembers.length.should.equal(1)
    childGroup.groupMembers.length.should.equal(1)
    parentGroup.isMember(user, DomainRegistry.groupMemberService).should.be.true
    childGroup.isMember(user, DomainRegistry.groupMemberService).should.be.true
  })

  it("AuthenticateUser", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let userDescriptor =
      ApplicationServiceRegistry
      .identityApplicationService
      .authenticateUser(new AuthenticateUserCommand(
        user.tenantId.id,
        user.username,
        fixture.PASSWORD))

    should.exist(userDescriptor)
    userDescriptor.username.should.equal(user.username)
  })

  it("DeactivateTenant", function() {
    let tenant = fixture.tenantAggregate()
    tenant.active.should.be.true

    ApplicationServiceRegistry
      .identityApplicationService
      .deactivateTenant(new DeactivateTenantCommand(tenant.tenantId.id))

    let changedTenant =
      DomainRegistry.tenantRepository.tenantOfId(tenant.tenantId)

    should.exist(changedTenant)
    changedTenant.name.should.equal(tenant.name)
    changedTenant.active.should.be.false
  })

  it("ChangeUserContactInformation", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserContactInformation(
        new ChangeContactInfoCommand(
          user.tenantId.id,
          user.username,
          "mynewemailaddress@saasovation.com",
          "777-555-1211",
          "777-555-1212",
          "123 Pine Street",
          "Loveland",
          "CO",
          "80771",
          "US"))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    changedUser.person.emailAddress.address.should.equal(
      "mynewemailaddress@saasovation.com")

    let info = changedUser.person.contactInformation
    info.primaryTelephone.number.should.equal("777-555-1211")
    info.secondaryTelephone.number.should.equal("777-555-1212")
    info.postalAddress.streetAddress.should.equal("123 Pine Street")
    info.postalAddress.city.should.equal("Loveland")
  })

  it("ChangeUserEmailAddress", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserEmailAddress(
        new ChangeEmailAddressCommand(
          user.tenantId.id,
          user.username,
          "mynewemailaddress@saasovation.com"))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    changedUser.person.emailAddress.address.should.equal(
      "mynewemailaddress@saasovation.com")
  })

  it("ChangeUserPostalAddress", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserPostalAddress(
        new ChangePostalAddressCommand(
          user.tenantId.id,
          user.username,
          "123 Pine Street",
          "Loveland",
          "CO",
          "80771",
          "US"))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    let info = changedUser.person.contactInformation
    info.postalAddress.streetAddress.should.equal("123 Pine Street")
    info.postalAddress.city.should.equal("Loveland")
  })

  it("ChangeUserPrimaryTelephone", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserPrimaryTelephone(
        new ChangePrimaryTelephoneCommand(
          user.tenantId.id,
          user.username,
          "777-555-1211"))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    changedUser.person.contactInformation
      .primaryTelephone.number.should.equal("777-555-1211")
  })

  it("ChangeUserSecondaryTelephone", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserSecondaryTelephone(
        new ChangeSecondaryTelephoneCommand(
          user.tenantId.id,
          user.username,
          "777-555-1212"))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    changedUser.person.contactInformation
      .secondaryTelephone.number.should.equal("777-555-1212")
  })

  it("ChangeUserPassword", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserPassword(
        new ChangeUserPasswordCommand(
          user.tenantId.id,
          user.username,
          fixture.PASSWORD,
          "THIS.IS.JOE'S.NEW.PASSWORD"))

    let userDescriptor =
      ApplicationServiceRegistry
      .identityApplicationService
      .authenticateUser(new AuthenticateUserCommand(
        user.tenantId.id,
        user.username,
        "THIS.IS.JOE'S.NEW.PASSWORD"))

    should.exist(userDescriptor)
    userDescriptor.username.should.equal(user.username)
  })

  it("ChangeUserPersonalName", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .changeUserPersonalName(
        new ChangeUserPersonalNameCommand(
          user.tenantId.id,
          user.username,
          "World",
          "Peace"))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    changedUser.person.name.asFormattedName().should.equal("World Peace")
  })

  it("DefineUserEnablement", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let now = new Date()
    let then = new Date(now.valueOf() + (60 * 60 * 24 * 365 * 1000))

    ApplicationServiceRegistry
      .identityApplicationService
      .defineUserEnablement(
        new DefineUserEnablementCommand(
          user.tenantId.id,
          user.username,
          true,
          now,
          then))

    let changedUser =
      DomainRegistry
      .userRepository
      .userWithUsername(
        user.tenantId,
        user.username)

    should.exist(changedUser)
    changedUser.enabled.should.be.true
  })

  it("IsGroupMember", function() {
    let parentGroup = fixture.group1Aggregate()
    DomainRegistry.groupRepository.add(parentGroup)

    let childGroup = fixture.group2Aggregate()
    DomainRegistry.groupRepository.add(childGroup)

    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    parentGroup.groupMembers.length.should.equal(0)
    childGroup.groupMembers.length.should.equal(0)

    parentGroup.addGroup(childGroup, DomainRegistry.groupMemberService)
    childGroup.addUser(user)

    ApplicationServiceRegistry
      .identityApplicationService
      .isGroupMember(
        parentGroup.tenantId.id,
        parentGroup.name,
        user.username).should.be.true

    ApplicationServiceRegistry
      .identityApplicationService
      .isGroupMember(
        childGroup.tenantId.id,
        childGroup.name,
        user.username).should.be.true
  })

  it("RemoveGroupFromGroup", function() {
    let parentGroup = fixture.group1Aggregate()
    DomainRegistry.groupRepository.add(parentGroup)

    let childGroup = fixture.group2Aggregate()
    DomainRegistry.groupRepository.add(childGroup)

    parentGroup.addGroup(childGroup, DomainRegistry.groupMemberService)

    parentGroup.groupMembers.length.should.equal(1)

    ApplicationServiceRegistry
      .identityApplicationService
      .removeGroupFromGroup(new RemoveGroupFromGroupCommand(
        parentGroup.tenantId.id,
        parentGroup.name,
        childGroup.name))

    parentGroup.groupMembers.length.should.equal(0)
  })

  it("RemoveUserFromGroup", function() {
    let parentGroup = fixture.group1Aggregate()
    DomainRegistry.groupRepository.add(parentGroup)

    let childGroup = fixture.group2Aggregate()
    DomainRegistry.groupRepository.add(childGroup)

    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    parentGroup.addGroup(childGroup, DomainRegistry.groupMemberService)
    childGroup.addUser(user)

    parentGroup.groupMembers.length.should.equal(1)
    childGroup.groupMembers.length.should.equal(1)
    parentGroup.isMember(user, DomainRegistry.groupMemberService).should.be.true
    childGroup.isMember(user, DomainRegistry.groupMemberService).should.be.true

    ApplicationServiceRegistry
      .identityApplicationService
      .removeUserFromGroup(new RemoveUserFromGroupCommand(
        childGroup.tenantId.id,
        childGroup.name,
        user.username))

    parentGroup.groupMembers.length.should.equal(1)
    childGroup.groupMembers.length.should.equal(0)
    parentGroup.isMember(user, DomainRegistry.groupMemberService)
      .should.be.false
    childGroup.isMember(user, DomainRegistry.groupMemberService).should.be.false
  })

  it("QueryTenant", function() {
    let tenant = fixture.tenantAggregate()

    let queriedTenant =
      ApplicationServiceRegistry
      .identityApplicationService
      .tenant(tenant.tenantId.id)

    should.exist(queriedTenant)
    queriedTenant.should.equal(tenant)
  })

  it("QueryUser", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let queriedUser =
      ApplicationServiceRegistry
      .identityApplicationService
      .user(user.tenantId.id, user.username)

    should.exist(user)
    queriedUser.should.equal(user)
  })

  it("QueryUserDescriptor", function() {
    let user = fixture.userAggregate()
    DomainRegistry.userRepository.add(user)

    let queriedUserDescriptor =
      ApplicationServiceRegistry
      .identityApplicationService
      .userDescriptor(user.tenantId.id, user.username)

    should.exist(user)
    _.isEqual(queriedUserDescriptor, user.userDescriptor).should.be.true
  })
})
