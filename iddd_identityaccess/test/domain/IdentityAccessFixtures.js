const { ContactInformation, EmailAddress, PostalAddress, Telephone } = require("../../domain/identity/IdentityValueObjects.js")

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


fixture.PASSWORD = "SecretPassword!"
fixture.TENANT_DESCRIPTION = "This is a test tenant."
fixture.TENANT_NAME = "Test Tenant"

fixture.USERNAME = "jdoe"
fixture.USERNAME2 = "zdoe"



module.exports = fixture
