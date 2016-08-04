const uuid = require("uuid")
const _ = require("underscore")

const ConcurrencySafeEntity = require("../../common/domain/ConcurrencySafeEntity")

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
    this.startingOn = null
    this.setUntil = null
    return this
  }


  assertValidInvitationDates() {
    // either both dates must be null, or both dates must be set
    if (this.startingOn == null && this.until == null) {; // valid
    } else if (this.startingOn == null || this.until == null &&
      this.startingOn != this.until) {
      throw new Error("IllegalState: This is an invalid open-ended invitation.");
    } else if (this.startingOn > this.until) {
      throw new Error("IllegalState: The starting date and time must be before the until date and time.");
    }
  }

  isIdentifiedBy(anInvitationIdentifier) {
      let isIdentified = this.invitationId == anInvitationIdentifier
      if (!isIdentified && this.description != null) {
          isIdentified = this.description == anInvitationIdentifier
      }
      return isIdentified
  }

  get available() {
      let isAvailable = false;
      if (this.startingOn == null && this.until == null) {
          isAvailable = true;
      } else {
          let time = new Date()
          if (time >= this.startingOn && time <= this.until) {
              isAvailable = true;
          }
      }
      return isAvailable;
  }

  get description() {
    return this._description
  }

  set description(aDescription) {

    this.assertArgumentNotEmpty(aDescription, "The invitation description is required.");
    this.assertArgumentLength(aDescription, 1, 100, "The invitation description must be 100 characters or less.");

    this._description = aDescription;
  }

  get invitationId() {
    return this._invitationId
  }

  set invitationId(anInvitationId) {
    this.assertArgumentNotEmpty(anInvitationId, "The invitationId is required.");
    this.assertArgumentLength(anInvitationId, 1, 36, "The invitation id must be 36 characters or less.");

    this._invitationId = anInvitationId;
  }

  get tenantId() {
    return this._tenantId
  }

  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId is required.");

    this._tenantId = aTenantId;
  }
}



module.exports = RegistrationInvitation

/*
public class RegistrationInvitation extends ConcurrencySafeEntity {

    public boolean isAvailable() {
        boolean isAvailable = false;
        if (this.startingOn() == null && this.until() == null) {
            isAvailable = true;
        } else {
            long time = (new Date()).getTime();
            if (time >= this.startingOn().getTime() && time <= this.until().getTime()) {
                isAvailable = true;
            }
        }
        return isAvailable;
    }



    public RegistrationInvitation openEnded() {
        this.setStartingOn(null);
        this.setUntil(null);
        return this;
    }

    public RegistrationInvitation redefineAs() {
        this.setStartingOn(null);
        this.setUntil(null);
        return this;
    }

    public RegistrationInvitation startingOn(Date aDate) {
        if (this.until() != null) {
            throw new IllegalStateException("Cannot set starting-on date after until date.");
        }

        this.setStartingOn(aDate);

        // temporary if until() properly follows, but
        // prevents illegal state if until() doesn't follow
        this.setUntil(new Date(aDate.getTime() + 86400000));

        return this;
    }

    public InvitationDescriptor toDescriptor() {
        return
                new InvitationDescriptor(
                        this.tenantId(),
                        this.invitationId(),
                        this.description(),
                        this.startingOn(),
                        this.until());
    }

    public RegistrationInvitation until(Date aDate) {
        if (this.startingOn() == null) {
            throw new IllegalStateException("Cannot set until date before setting starting-on date.");
        }

        this.setUntil(aDate);

        return this;
    }
\
}
*/
