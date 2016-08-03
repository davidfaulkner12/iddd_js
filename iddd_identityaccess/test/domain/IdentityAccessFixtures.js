const { ContactInformation, EmailAddress, PostalAddress, Telephone, TenantId, Enablement, FullName } = require("../../domain/identity/IdentityValueObjects.js")
const Person = require("../../domain/identity/Person")
const User = require("../../domain/user.js")
const uuid = require("uuid")

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

fixture.tenantAggregate = function() {
  // TODO
  return {
    tenantId: new TenantId(uuid.v4())
  }
}

fixture.personEntity = function(aTenant) {

        let person =
            new Person(
                    aTenant.tenantId,
                    new FullName("John", "Doe"),
                    fixture.contactInformation());

        return person;
    }

fixture.userAggregate = function() {

   let user = new User(
                    fixture.tenantAggregate().tenantId,
                    fixture.USERNAME,
                    fixture.PASSWORD,
                    new Enablement(true, null, null),
                    fixture.personEntity(fixture.tenantAggregate())
                  )


    return user;
}

module.exports = fixture
