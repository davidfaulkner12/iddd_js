const crypto = require('crypto')

const AssertionConcern = require("../../common/AssertionConcern")

class EncryptionService extends AssertionConcern {

  encryptedValue(aPlainTextValue) {
    this.assertArgumentNotEmpty(
      aPlainTextValue,
      "Plain text value to encrypt must be provided.")

    let hash = crypto.createHash('sha256')
    hash.update(aPlainTextValue)
    let encryptedValue = hash.digest('hex')

    return encryptedValue
  }
}

module.exports = EncryptionService
