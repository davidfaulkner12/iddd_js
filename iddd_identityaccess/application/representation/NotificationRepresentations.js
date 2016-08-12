module.exports.NotificationLogRepresentation = class {

  constructor(aLog) {
      this.archived = aLog.archived
      this.id = aLog.notificationLogId
      this.notifications = aLog.notifications
  }
}
