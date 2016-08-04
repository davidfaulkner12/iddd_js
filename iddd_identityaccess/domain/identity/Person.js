const ConcurrencySafeEntity = require("../../common/domain/ConcurrencySafeEntity")
const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")
const {
  ContactInformation,
  FullName,
  TenantId,
  User
} = require("./IdentityValueObjects")

class Person extends ConcurrencySafeEntity {
  constructor(
    aTenantId,
    aName,
    aContactInformation) {

    super()

    this.contactInformation = aContactInformation
    this.name = aName
    this.tenantId = aTenantId
    this._user = null
  }

  changeContactInformation(aContactInformation) {
    this.contactInformation = aContactInformation

    DomainEventPublisher
      .instance()
      .publish("PersonContactInformationChanged", {
        tenantId: this.tenantId,
        username: this.user.username,
        contactInformation: this.contactInformation
      })
  }

  changeName(aName) {
    this.name = aName

    DomainEventPublisher
      .instance()
      .publish("PersonNameChanged", {
        tenantId: this.tenantId,
        username: this.user.username,
        name: this.name
      });
  }

  get contactInformation() {
    return this._contactInformation
  }

  get name() {
    return this._name
  }

  get tenantId() {
    return this._tenantId
  }

  get user() {
    return this._user
  }

  get emailAddress() {
    return this._contactInformation.emailAddress
  }

  set contactInformation(aContactInformation) {
    this.assertArgumentNotNull(aContactInformation, "The person contact information is required.")
    this._contactInformation = aContactInformation
  }

  set name(aName) {
    this.assertArgumentNotNull(aName, "The person name is required.")

    this._name = aName
  }

  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId is required.")

    this._tenantId = aTenantId;
  }
}

module.exports = Person
