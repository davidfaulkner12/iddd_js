const IdentifiedDomainObject = require("../../common/domain/IdentifiedDomainObject")

const GroupMemberType = require("./GroupMemberType")

class GroupMember extends IdentifiedDomainObject {

  isGroup() {
    return this.type == GroupMemberType.GROUP
  }

  isUser() {
    return this.type == GroupMemberType.USER
  }

  get name() {
    return this._name;
  }

  get tenantId() {
    return this._tenantId;
  }

  get type() {
    return this._type;
  }

  constructor(aTenantId, aName, aType) {
    super()

    this.name = aName
    this.tenantId = aTenantId
    this.type = aType
  }

  set name(aName) {
    this.assertArgumentNotEmpty(aName, "Member name is required.");
    this.assertArgumentLength(aName, 1, 100, "Member name must be 100 characters or less.");

    this._name = aName;
  }

  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId must be provided.");

    this._tenantId = aTenantId;
  }

  set type(aType) {
    this.assertArgumentNotNull(aType, "The type must be provided.");

    this.assertArgumentTrue(aType == GroupMemberType.GROUP || aType  == GroupMemberType.USER, "Invalid group member type")

    this._type = aType;
  }
}

module.exports = GroupMember
