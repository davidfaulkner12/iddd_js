let ContactInformation = require("../../domain/identity/ContactInformation")
let EmailAddress = require("../../domain/identity/EmailAddress.js")
let PostalAddress = require("../../domain/identity/PostalAddress.js")
let Telephone = require("../../domain/identity/Telephone.js")

let fixture = {}

const USER_EMAIL_ADDRESS = fixture.USER_EMAIL_ADDRESS = "jdoe@saasovation.com"
fixture.USER_EMAIL_ADDRESS2 = "zdoe@saasovation.com"

const TWENTY_FOUR_HOURS = fixture.TWENTY_FOUR_HOURS = (1000 * 60 * 60 * 24)

fixture.today = function() {
  return new Date()
}

fixture.tomorrow = function() {
  return new Date(fixture.today().valueOf() + TWENTY_FOUR_HOURS)
}

fixture.yesterday = function() {
  return new Date(fixture.today().valueOf() - TWENTY_FOUR_HOURS)
}

fixture.dayBeforeYesterday = function() {
  return new Date(fixture.today().valueOf() - TWENTY_FOUR_HOURS * 2)
}

fixture.dayAfterTomorrow = function() {
  return new Date(fixture.today().valueOf() + TWENTY_FOUR_HOURS * 2)
}

fixture.contactInformation = function() {
  let contactInformation =
    new ContactInformation(
            new EmailAddress(USER_EMAIL_ADDRESS),
            new PostalAddress(
                    "123 Pearl Street",
                    "Boulder",
                    "CO",
                    "80301",
                    "US"),
            new Telephone("303-555-1210"),
            new Telephone("303-555-1212"));
  return contactInformation
}

module.exports = fixture
