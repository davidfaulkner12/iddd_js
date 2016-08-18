const _ = require("underscore")
const uuid = require("uuid")

const TenantId = require("./TenantId")

const InMemoryRepository = require("./InMemoryRepository")

class TenantRepository extends InMemoryRepository {

  nextIdentity() {
    return new TenantId(uuid.v4())
  }

  tenantNamed(aName) {
    let values = _.values(this._repository)

    let tenant = _.find(
      values,
      (aTenant) => {
        return aTenant.name === aName
      }
    )

    return tenant || null
  }

  tenantOfId(aTenantId) {
    return this._repository[this.keyOf(aTenantId)]
  }

  keyOf(aThing) {
    if (_.has(aThing, "tenantId")) {
      return this.keyOf(aThing.tenantId)
    } else if (aThing.id) {
      return aThing.id
    }
    throw new Error("IllegalArgument: cannot find key of argument")
  }
}

module.exports = TenantRepository
