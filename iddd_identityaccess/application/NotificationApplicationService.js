const {
  NotificationLogFactory,
  NotificationLogId
} = require("../common/notification/Notifications")

class NotificationApplicationService {

  constructor(anEventStore, aNotificationPublisher) {
    this.eventStore = anEventStore
    this.notificationPublisher = aNotificationPublisher
  }

  currentNotificationLog() {
    let factory = new NotificationLogFactory(this.eventStore);

    return factory.createCurrentNotificationLog();
  }

  notificationLog(aNotificationLogId) {
    let factory = new NotificationLogFactory(this.eventStore);

    return factory.createNotificationLog(NotificationLogId.decode(aNotificationLogId));
  }

  publishNotifications() {
    this.notificationPublisher.publishNotifications();
  }
}

module.exports = NotificationApplicationService
