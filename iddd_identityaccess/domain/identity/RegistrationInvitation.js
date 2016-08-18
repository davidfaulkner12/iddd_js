const ConcurrencySafeEntity =
  require("../../common/domain/ConcurrencySafeEntity")

class RegistrationInvitation extends ConcurrencySafeEntity {
  constructor(aTenantId,
    anInvitationId,
    aDescription) {
    super()

    this.description = aDescription
    this.invitationId = anInvitationId
    this.tenantId = aTenantId

    this.assertValidInvitationDates()
  }

  openEnded() {
    this._startingOn = null
    this._until = null
    return this
  }

  redefineAs() {
    this._startingOn = null
    this._until = null
    return this
  }

  isIdentifiedBy(anInvitationIdentifier) {
    let isIdentified = this.invitationId === anInvitationIdentifier
    if (!isIdentified && this.description) {
      isIdentified = this.description === anInvitationIdentifier
    }
    return isIdentified
  }

  startingOn(aDate) {
    if (this._until) {
      throw new Error("Cannot set starting-on date after _until date.")
    }

    this._startingOn = aDate

    // temporary if _until() properly follows, but
    // prevents illegal state if _until() doesn't follow
    this._until = new Date(aDate.getTime() + 86400000)

    return this
  }

  until(aDate) {
    if (!this._startingOn) {
      throw new Error("Cannot set until date before setting starting-on date.")
    }

    this._until = aDate

    return this
  }

  assertValidInvitationDates() {
    // either both dates must be null, or both dates must be set
    if (!this._startingOn && !this._until) { // valid
    } else if (!this._startingOn || !this._until &&
      this._startingOn !== this._until) {
      throw new Error("IllegalState: This is an invalid open-ended invitation.")
    } else if (this._startingOn > this._until) {
      throw new Error(
        "IllegalState: The starting date and time must be" +
        "before the _until date and time.")
    }
  }

  get available() {
    let isAvailable = false
    if (!this._startingOn && !this._until) {
      isAvailable = true
    } else {
      let time = new Date()
      if (time >= this._startingOn && time <= this._until) {
        isAvailable = true
      }
    }
    return isAvailable
  }

  get description() {
    return this._description
  }

  set description(aDescription) {
    this.assertArgumentNotEmpty(aDescription,
      "The invitation description is required.")
    this.assertArgumentLength(aDescription, 1, 100,
      "The invitation description must be 100 characters or less.")

    this._description = aDescription
  }

  get invitationId() {
    return this._invitationId
  }

  set invitationId(anInvitationId) {
    this.assertArgumentNotEmpty(anInvitationId,
      "The invitationId is required.")
    this.assertArgumentLength(anInvitationId, 1, 36,
      "The invitation id must be 36 characters or less.")

    this._invitationId = anInvitationId
  }

  get tenantId() {
    return this._tenantId
  }

  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId is required.")

    this._tenantId = aTenantId
  }
}

module.exports = RegistrationInvitation
