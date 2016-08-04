const _ = require("underscore")

class InMemoryRepository {
  constructor() {
    this._repository = {}
  }

  add(anEntity) {
    let key = this.keyOf(anEntity)

    if (_.has(this._repository, key)) {
      throw new Error("IllegalState: Duplicate key.");
    }

    this._repository[key] = anEntity
  }


  remove(aTenant) {
      let key = this.keyOf(aTenant)

      delete this._repository[key]
  }

  clean() {
    this._repository = {}
  }
}

module.exports = InMemoryRepository
