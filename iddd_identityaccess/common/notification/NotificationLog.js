const NotificationLogId = require("./NotificationLogId")

class NotificationLog {

  constructor(
      aNotificationLogId,
      aNextNotificationLogId,
      aPreviousNotificationLogId,
      aNotifications,
      anArchivedIndicator) {
    this.archived = anArchivedIndicator
    this.nextNotificationLogId = aNextNotificationLogId
    this.notificationLogId = aNotificationLogId
    this.notifications = aNotifications
    this.previousNotificationLogId = aPreviousNotificationLogId
  }

  totalNotifications() {
    return this.notifications.length
  }

  hasNextNotificationLog() {
    return Boolean(this.nextNotificationLogId)
  }

  hasPreviousNotificationLog() {
    return Boolean(this.previousNotificationLogId)
  }

  isArchived() {
    return this.archived
  }

  decodedNotificationLogId() {
    return NotificationLogId.decode(this.notificationLogId)
  }

  decodedPreviousNotificationLogId() {
    return NotificationLogId.decode(this.previousNotificationLogId)
  }

  decodedNextNotificationLogId() {
    return NotificationLogId.decode(this.nextNotificationLogId)
  }
}

module.exports = NotificationLog
