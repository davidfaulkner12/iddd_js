const AssertionConcern = require("../../common/AssertionConcern")

const DIGITS = "0123456789"
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const STRONG_THRESHOLD = 20
const SYMBOLS = "\"`!?$?%^&*()_-+={[}]:;@'~#|\\<,>.?/"
const VERY_STRONG_THRESHOLD = 40

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

class PasswordService extends AssertionConcern {

  generateStrongPassword() {
    let password = ""

    let isStrong = false

    let index = 0

    while (!isStrong) {
      let opt = getRandomInt(4)
      switch (opt) {
        case 0:
          index = getRandomInt(LETTERS.length)
          password += LETTERS.substring(index, index + 1)
          break
        case 1:
          index = getRandomInt(LETTERS.length)
          password += LETTERS.substring(index, index + 1).toLowerCase()
          break
        case 2:
          index = getRandomInt(DIGITS.length)
          password += DIGITS.substring(index, index + 1)
          break
        case 3:
          index = getRandomInt(SYMBOLS.length)
          password += SYMBOLS.substring(index, index + 1)
          break
        default:
          break // Never gets here
      }

      if (password.length >= 7) {
        isStrong = this.isStrong(password)
      } else if (password.length >= 99) {
        throw new Error("Something has gone horribly wrong, no infinite loop")
      }
    }

    return password
  }

  isStrong(aPlainTextPassword) {
    return this._calculatePasswordStrength(aPlainTextPassword) >=
      STRONG_THRESHOLD
  }

  isVeryStrong(aPlainTextPassword) {
    return this._calculatePasswordStrength(aPlainTextPassword) >=
      VERY_STRONG_THRESHOLD
  }

  isWeak(aPlainTextPassword) {
    return this._calculatePasswordStrength(aPlainTextPassword) <
      STRONG_THRESHOLD
  }

  _calculatePasswordStrength(aPlainTextPassword) {
    this.assertArgumentNotNull(aPlainTextPassword,
      "Password strength cannot be tested on null.")

    let strength = 0

    let length = aPlainTextPassword.length

    if (length > 7) {
      strength += 10
        // bonus: one polet each additional
      strength += (length - 7)
    }

    let digitCount = 0
    let letterCount = 0
    let lowerCount = 0
    let upperCount = 0
    let symbolCount = 0

    for (let idx = 0; idx < length; ++idx) {
      let ch = aPlainTextPassword.charAt(idx)

      if (/[A-Za-z]/.test(ch)) {
        ++letterCount
        if (/[A-Z]/.test(ch)) {
          ++upperCount
        } else {
          ++lowerCount
        }
      } else if (isNaN(ch)) {
        ++symbolCount
      } else {
        ++digitCount
      }
    }

    strength += (upperCount + lowerCount + symbolCount)

    // bonus: letters and digits
    if (letterCount >= 2 && digitCount >= 2) {
      strength += (letterCount + digitCount)
    }

    return strength
  }

}

module.exports = PasswordService
