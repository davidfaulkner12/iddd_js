const Group = require("../identity/Group")
const ConcurrencySafeEntity = require("../../common/domain/ConcurrencySafeEntity")

const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")


const uuid = require("uuid")

class Role extends ConcurrencySafeEntity {
  constructor(
    aTenantId,
    aName,
    aDescription,
    aSupportsNesting = false) {

    super()

    this.description = aDescription
    this.name = aName
    this.supportsNesting = aSupportsNesting
    this.tenantId = aTenantId

    this.createInternalGroup()
  }

  assignUser(aUser) {
    this.assertArgumentNotNull(aUser, "User must not be null.")
    this.assertArgumentEquals(this.tenantId, aUser.tenantId, "Wrong tenant for this user.")

    this.group.addUser(aUser);

    // NOTE: Consider what a consuming Bounded Context would
    // need to do if this event was not enriched with the
    // last three user person properties. (Hint: A lot.)
    DomainEventPublisher
      .publish("UserAssignedToRole", {
        tenantId: this.tenantId,
        name: this.name,
        username: aUser.username,
        firstName: aUser.person.name.firstName,
        lastName: aUser.person.name.lastName,
        emailAddress: aUser.person.emailAddress.address
      })
  }


  createInternalGroup() {
    let groupName =
      Group.ROLE_GROUP_PREFIX +
      uuid.v4();

    this.group = new Group(
      this.tenantId,
      groupName,
      "Role backing group for: " + this.name)
  }


  assignGroup(aGroup, aGroupMemberService) {
    this.assertStateTrue(this.supportsNesting, "This role does not support group nesting.");
    this.assertArgumentNotNull(aGroup, "Group must not be null.");
    this.assertArgumentEquals(this.tenantId, aGroup.tenantId, "Wrong tenant for this group.");

    this.group.addGroup(aGroup, aGroupMemberService);

    DomainEventPublisher
      .publish("GroupAssignedToRole", {
        tenantId: this.tenantId,
        name: this.name,
        groupName: aGroup.name
      })
  }



  unassignGroup(aGroup) {
    this.assertStateTrue(this.supportsNesting, "This role does not support group nesting.")
    this.assertArgumentNotNull(aGroup, "Group must not be null.")
    this.assertArgumentEquals(this.tenantId, aGroup.tenantId, "Wrong tenant for this group.")

    this.group.removeGroup(aGroup)

    DomainEventPublisher
      .publish("GroupUnassignedFromRole", {
        tenantId: this.tenantId,
        name: this.name,
        groupName: aGroup.name
      })
  }

  unassignUser(aUser) {
    this.assertArgumentNotNull(aUser, "User must not be null.")
    this.assertArgumentEquals(this.tenantId, aUser.tenantId, "Wrong tenant for this user.")

    this.group.removeUser(aUser)

    DomainEventPublisher
      .publish("UserUnassignedFromRole", {
        tenantId: this.tenantId,
        name: this.name,
        username: aUser.username
      })
  }

  isInRole(aUser, aGroupMemberService) {
    return this.group.isMember(aUser, aGroupMemberService);
  }


  set description(aDescription) {
    this.assertArgumentNotEmpty(aDescription, "Role description is required.")
    this.assertArgumentLength(aDescription, 1, 250, "Role description must be 250 characters or less.")

    this._description = aDescription;
  }


  get description() {
    return this._description;
  }


  set name(aName) {
    this.assertArgumentNotEmpty(aName, "Role name must be provided.");
    this.assertArgumentLength(aName, 1, 250, "Role name must be 100 characters or less.");

    this._name = aName;
  }

  get name() {
    return this._name
  }


  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId is required.");

    this._tenantId = aTenantId;
  }


  get tenantId() {
    return this._tenantId;
  }
}

module.exports = Role
