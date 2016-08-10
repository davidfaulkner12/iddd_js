const AssertionConcern = require("../AssertionConcern")

class Notification extends AssertionConcern {

  constructor(
    aNotificationId,
    anEventName,
    anEvent) {

    super()

    this.notificationId = aNotificationId
    this.occurredOn = anEvent.occurredOn
    this.version = anEvent.eventVersion

    this.event = anEvent
    this.typeName = anEventName


  }

  set event(anEvent) {
    this.assertArgumentNotNull(anEvent, "The event is required.");

    this._event = anEvent;
  }

  get event() {
    return this._event
  }

  set typeName(aTypeName) {
    this.assertArgumentNotEmpty(aTypeName, "The type name is required.");
    this.assertArgumentLength(aTypeName, 100, "The type name must be 100 characters or less.");

    this._typeName = aTypeName;
  }

  get typeName() {
    return this._typeName
  }

}

module.exports = Notification
