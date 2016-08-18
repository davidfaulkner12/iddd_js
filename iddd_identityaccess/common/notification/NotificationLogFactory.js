const _ = require("underscore")

const NOTIFICATIONS_PER_LOG = 20

const NotificationLogInfo = require("./NotificationLogInfo")
const NotificationLogId = require("./NotificationLogId")
const Notification = require("./Notification")
const NotificationLog = require("./NotificationLog")

class NotificationLogFactory {
  constructor(anEventStore) {
    this.eventStore = anEventStore
  }

  createCurrentNotificationLog() {
    return this._createNotificationLogFromInfo(
      this._calculateCurrentNotificationLogId(this.eventStore))
  }

  createNotificationLog(aNotificationLogId) {
    let count = this.eventStore.countStoredEvents()

    let info = new NotificationLogInfo(aNotificationLogId, count)

    return this._createNotificationLogFromInfo(info)
  }

  _calculateCurrentNotificationLogId(anEventStore) {
    let count = anEventStore.countStoredEvents()

    let remainder = count % NOTIFICATIONS_PER_LOG

    if (remainder === 0 && count > 0) {
      remainder = NOTIFICATIONS_PER_LOG
    }

    let low = count - remainder + 1

    // ensures a minted id value even though there may
    // not be a full set of notifications at present
    let high = low + NOTIFICATIONS_PER_LOG - 1

    return new NotificationLogInfo(new NotificationLogId(low, high), count)
  }

  _createNotificationLogFromInfo(aNotificationLogInfo) {
    let storedEvents =
      this.eventStore.allStoredEventsBetween(
        aNotificationLogInfo.notificationLogId.low,
        aNotificationLogInfo.notificationLogId.high)

    let archivedIndicator =
      aNotificationLogInfo.notificationLogId.high <
        aNotificationLogInfo.totalLogged

    let next = archivedIndicator ?
      aNotificationLogInfo.notificationLogId.next(NOTIFICATIONS_PER_LOG) :
      null

    let previous =
      aNotificationLogInfo.notificationLogId.previous(NOTIFICATIONS_PER_LOG)

    let notificationLog =
      new NotificationLog(
        aNotificationLogInfo.notificationLogId.encoded(),
        NotificationLogId.encoded(next),
        NotificationLogId.encoded(previous),
        this._notificationsFrom(storedEvents),
        archivedIndicator)

    return notificationLog
  }

  _notificationsFrom(aStoredEvents) {
    let notifications = _.map(aStoredEvents, (storedEvent) => {
      let name = storedEvent.name

      let domainEvent = storedEvent.domainEvent

      return new Notification(storedEvent.eventId, name, domainEvent)
    })

    return notifications
  }

}

NotificationLogFactory.notificationsPerLog = () => {
  return NOTIFICATIONS_PER_LOG
}

module.exports = NotificationLogFactory
