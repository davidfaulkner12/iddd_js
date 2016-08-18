const InMemoryRepository = require("./InMemoryRepository")

const _ = require("underscore")

const Group = require("./Group")

class GroupRepository extends InMemoryRepository {

  keyOf(aGroup) {
    return aGroup.tenantId + "#" + aGroup.name
  }

  allGroups(aTenantId) {
    return _.filter(this.repository, (group) => {
      return group.tenantId === aTenantId
    })
  }

  groupNamed(aTenantId, aName) {
    if (aName.startsWith(Group.ROLE_GROUP_PREFIX)) {
      throw new Error("IllegalArgument: May not find internal groups.")
    }

    let key = aTenantId + "#" + aName

    return this.repository[key]
  }
}

module.exports = GroupRepository
