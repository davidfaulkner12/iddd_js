const _ = require("underscore")

const AssertionConcern = require("../AssertionConcern")

class NotificationLogId extends AssertionConcern {

  constructor(aLowId, aHighId) {
    super()

    this.assertArgumentNotNull(aLowId, "Low number must be provided")
    this.assertArgumentNotNull(aHighId, "High number must be provided")

    this.low = parseInt(aLowId, 10)
    this.high = parseInt(aHighId, 10)
  }

  encoded() {
    return String(this.low) + "," + this.high
  }

  next(aNotificationsPerLog) {
    let nextLow = this.high + 1

    // ensures a minted id value even though there may
    // not be this many notifications at present
    let nextHigh = nextLow + aNotificationsPerLog - 1

    let next = new NotificationLogId(nextLow, nextHigh)

    if (_.isEqual(this, next)) {
      next = null
    }

    return next
  }

  previous(aNotificationsPerLog) {
    let previousLow = Math.max(this.low - aNotificationsPerLog, 1)

    let previousHigh = previousLow + aNotificationsPerLog - 1

    let previous = new NotificationLogId(previousLow, previousHigh)

    if (_.isEqual(this, previous)) {
      previous = null
    }

    return previous
  }
}

NotificationLogId.first = (aNotificationsPerLog) => {
  let id = new NotificationLogId(0, 0)

  return id.next(aNotificationsPerLog)
}

NotificationLogId.encoded = (aNotificationLogId) => {
  let encodedId = null

  if (aNotificationLogId) {
    encodedId = aNotificationLogId.encoded()
  }

  return encodedId
}

NotificationLogId.decode = (aNotificationLogIdAsString) => {
  let [aLowId, aHighId] = aNotificationLogIdAsString.split(",")
  return new NotificationLogId(aLowId, aHighId)
}

module.exports = NotificationLogId
