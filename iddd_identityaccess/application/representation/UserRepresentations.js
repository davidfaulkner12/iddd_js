module.exports.UserRepresentation = class {
  constructor(aUser) {
          this.emailAddress = aUser.person.emailAddress.address
          this.enabled = aUser.enabled
          this.firstName = aUser.person.name.firstName
          this.lastName = aUser.person.name.lastName
          this.tenantId = aUser.tenantId
          this.username = aUser.username
      }
}

module.exports.UserInRoleRepresentation = class {
  constructor(aUser, aRole) {
      let desc = aUser.userDescriptor
      this.emailAddress = desc.emailAddress
      this.firstName = aUser.person.name.firstName
      this.lastName = aUser.person.name.lastName
      this.role = aRole
      this.tenantId = desc.tenantId.id
      this.username = desc.username
  }
}
