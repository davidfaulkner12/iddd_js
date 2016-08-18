const _ = require("underscore")

class GroupMemberService {

  constructor(aUserRepository, aGroupRepository) {
    this.groupRepository = aGroupRepository
    this.userRepository = aUserRepository
  }

  confirmUser(aGroup, aUser) {
    let userConfirmed = true

    let confirmedUser =
      this.userRepository
      .userWithUsername(aGroup.tenantId, aUser.username)

    if (!confirmedUser || !confirmedUser.enabled) {
      userConfirmed = false
    }

    return userConfirmed
  }

  isMemberGroup(aGroup, aMemberGroup) {
    let isMember = false

    for (let member of aGroup.groupMembers) {
      if (member.isGroup()) {
        if (_.isEquals(aMemberGroup, member)) {
          isMember = true
          break
        } else {
          let group =
            this.groupRepository.groupNamed(member.tenantId, member.name)
          if (group) {
            isMember = this.isMemberGroup(group, aMemberGroup)
          }
        }
      }
    }

    return isMember
  }

  isUserInNestedGroup(aGroup, aUser) {
    let isInNestedGroup = false

    for (let member of aGroup.groupMembers) {
      if (member.isGroup()) {
        let group =
          this.groupRepository.groupNamed(member.tenantId, member.name)
        if (group) {
          isInNestedGroup = group.isMember(aUser, this)
        }
      }
    }

    return isInNestedGroup
  }
}

module.exports = GroupMemberService
