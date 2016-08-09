const ConcurrencySafeEntity = require("../common/domain/ConcurrencySafeEntity")
const DomainEventPublisher = require("../common/domain/DomainEventPublisher")
const {
  Enablement,
  ContactInformation,
  FullName,
  EmailAddress,
  PostalAddress,
  Telephone,
  TenantId
} = require("./identity/IdentityValueObjects")

const GroupMember = require("./identity/GroupMember")
const GroupMemberType = require("./identity/GroupMemberType")
const DomainRegistry = require("./DomainRegistry")

class User extends ConcurrencySafeEntity {


  constructor(
    aTenantId,
    aUsername,
    aPassword,
    anEnablement,
    aPerson) {

    super()

    this.enablement = anEnablement
    this.person = aPerson
    this.tenantId = aTenantId
    this.username = aUsername

    this.protectPassword("", aPassword)

    aPerson._user = this

    DomainEventPublisher
      .publish("UserRegistered", {
        tenantId: this.tenantId,
        username: aUsername,
        name: aPerson.name,
        emailAddress: aPerson.contactInformation.emailAddress
      })
  }

  set username(aUsername) {
    this.assertArgumentNotEmpty(aUsername, "The username is required.");
    this.assertArgumentLength(aUsername, 3, 250, "The username must be 3 to 250 characters.");

    this._username = aUsername;
  }


  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId is required.");

    this._tenantId = aTenantId;
  }

  set password(aPassword) {
    this._password = aPassword;
  }

  set person(aPerson) {
    this.assertArgumentNotNull(aPerson, "The person is required.");

    this._person = aPerson;
  }


  set enablement(anEnablement) {
    this.assertArgumentNotNull(anEnablement, "The enablement is required.");

    this._enablement = anEnablement;
  }


  get enablement() {
    return this._enablement;
  }


  get username() {
    return this._username;
  }


  get enabled() {
    return this.enablement.isEnablementEnabled()
  }

  get person() {
    return this._person;
  }

  get tenantId() {
    return this._tenantId;
  }

  internalAccessOnlyEncryptedPassword() {
    return this._password;
  }


  assertUsernamePasswordNotSame(aPlainTextPassword) {
    this.assertArgumentNotEquals(
      this.username,
      aPlainTextPassword,
      "The username and password must not be the same.");
  }

  protectPassword(aCurrentPassword, aChangedPassword) {
    this.assertPasswordsNotSame(aCurrentPassword, aChangedPassword);

    this.assertPasswordNotWeak(aChangedPassword);

    this.assertUsernamePasswordNotSame(aChangedPassword);

    this.password = this.asEncryptedValue(aChangedPassword);
  }


  assertPasswordNotWeak(aPlainTextPassword) {

    this.assertArgumentFalse(
      DomainRegistry.passwordService.isWeak(aPlainTextPassword),
      false,
      "The password must be stronger.");

  }

  asEncryptedValue(aPlainTextPassword) {

     let encryptedValue =
        DomainRegistry
            .encryptionService
            .encryptedValue(aPlainTextPassword);
    return encryptedValue
  }

  assertPasswordsNotSame(aCurrentPassword, aChangedPassword) {
    this.assertArgumentNotEquals(
      aCurrentPassword,
      aChangedPassword,
      "The password is unchanged.");
  }





  get userDescriptor() {
    return {
      tenantId: this.tenantId,
      username: this.username,
      emailAddress: this.person.emailAddress.address,
      nullDescriptor: false
    }
  }



  toGroupMember() {
    let groupMember =
      new GroupMember(
        this.tenantId,
        this.username,
        GroupMemberType.USER);

    return groupMember
  }



  changePassword(aCurrentPassword, aChangedPassword) {
    this.assertArgumentNotEmpty(
      aCurrentPassword,
      "Current and new password must be provided.")

    this.assertArgumentEquals(
      this._password,
      this.asEncryptedValue(aCurrentPassword),
      "Current password not confirmed.")

    this.protectPassword(aCurrentPassword, aChangedPassword)

    DomainEventPublisher
      .instance()
      .publish("UserPasswordChanged", {
        tenantId: this.tenantId,
        username: this.username
      })
  }

  changePersonalContactInformation(aContactInformation) {
    this.person.changeContactInformation(aContactInformation)
  }

  changePersonalName(aPersonalName) {
    this.person.changeName(aPersonalName)
  }

  defineEnablement(anEnablement) {
    this.enablement = anEnablement

    DomainEventPublisher
      .instance()
      .publish("UserEnablementChanged", {
        tenantId: this.tenantId,
        username: this.username,
        enablement: this.enablement
      })
  }

}

User.nullDescriptorInstance = function() {
  return {
    tenantId: null,
    username: null,
    emailAddress: null,
    nullDescriptor: true
  }
}

module.exports = User
