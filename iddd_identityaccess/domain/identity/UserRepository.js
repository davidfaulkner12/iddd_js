const InMemoryRepository = require("./InMemoryRepository")

const _ = require("underscore")

class UserRepository extends InMemoryRepository {
  super() {
    this()
  }

  keyOf(aUser) {
    return aUser.tenantId + "#" + aUser.username
  }

  userWithUsername(aTenantId, aUsername) {
    let user = _.find(_.values(this.repository), user => {
      return _.isEqual(user.tenantId, aTenantId) && user.username === aUsername
    })
    return user
  }

  allSimilarlyNamedUsers(
      aTenantId,
      aFirstNamePrefix,
      aLastNamePrefix) {
    aFirstNamePrefix = aFirstNamePrefix.toLowerCase()
    aLastNamePrefix = aLastNamePrefix.toLowerCase()

    return _.filter(_.values(this.repository),
      user => {
        return _.isEqual(user.tenantId, aTenantId) &&
          user.person.name.firstName.toLowerCase()
            .startsWith(aFirstNamePrefix) &&
          user.person.name.lastName.toLowerCase().startsWith(aLastNamePrefix)
      })
  }

  userFromAuthenticCredentials(
      aTenantId,
      aUsername,
      anEncryptedPassword) {
    return _.find(this.repository, user => {
      return _.isEqual(user.tenantId, aTenantId) &&
        user.username === aUsername &&
        user._password === anEncryptedPassword
    })
  }
}

module.exports = UserRepository
