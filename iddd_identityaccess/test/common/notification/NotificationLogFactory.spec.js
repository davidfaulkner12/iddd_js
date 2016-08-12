const chai = require("chai")
const should = chai.should()

const MockEventStore = require("../event/MockEventStore")

const {
  NotificationLogFactory,
  NotificationLogInfo,
  NotificationLogId,
  Notification,
  NotificationLog
} = require("../../../common/notification/Notifications")

describe("NotificationLog", function() {

  before(function() {
    this.eventStore = () => {
      return new MockEventStore()
    }
  })

  it("Should have a previous for the notification id", function() {
    let id = new NotificationLogId(821, 841)
    should.exist(id.previous(20))
  })

  it("CurrentNotificationLogFromFactory", function() {
      let eventStore = this.eventStore();
      let factory = new NotificationLogFactory(eventStore);
      let log = factory.createCurrentNotificationLog();

      NotificationLogFactory.notificationsPerLog().should.be.at.least(log.totalNotifications())
      eventStore.countStoredEvents().should.be.at.least(log.totalNotifications())
      log.hasNextNotificationLog().should.be.false
      log.hasPreviousNotificationLog().should.be.true
      log.isArchived().should.be.false
  })

  it("FirstNotificationLogFromFactory", function() {
      let eventStore = this.eventStore();
      let id = NotificationLogId.first(NotificationLogFactory.notificationsPerLog());
      let factory = new NotificationLogFactory(eventStore);
      let log = factory.createNotificationLog(id);

      NotificationLogFactory.notificationsPerLog().should.equal(log.totalNotifications())
      eventStore.countStoredEvents().should.be.at.least(log.totalNotifications())
      log.hasNextNotificationLog().should.be.true
      log.hasPreviousNotificationLog().should.be.false
      log.isArchived().should.be.true
  })

  it("PreviousOfCurrentNotificationLogFromFactory", function() {
      let eventStore = this.eventStore();
      let totalEvents = eventStore.countStoredEvents();
      let shouldBePrevious = totalEvents > (NotificationLogFactory.notificationsPerLog() * 2);
      let factory = new NotificationLogFactory(eventStore);
      let log = factory.createCurrentNotificationLog();

      let previousId = log.decodedPreviousNotificationLogId();
      log = factory.createNotificationLog(previousId);

      NotificationLogFactory.notificationsPerLog().should.equal(log.totalNotifications())
      totalEvents.should.be.at.least(log.totalNotifications())
      log.hasNextNotificationLog().should.be.true
      shouldBePrevious.should.equal(log.hasPreviousNotificationLog())
      log.isArchived().should.be.true
  })

  it("EncodedWithDecodedNavigationIds", function() {
      let eventStore = this.eventStore();
      let factory = new NotificationLogFactory(eventStore);
      let log = factory.createCurrentNotificationLog();

      let currentId = log.notificationLogId;
      let decodedCurrentLogId = log.decodedNotificationLogId();
      log.decodedNotificationLogId().should.deep.equal( NotificationLogId.decode(currentId))

      let previousId = log.previousNotificationLogId;
      let decodedPreviousLogId = log.decodedPreviousNotificationLogId();
      decodedPreviousLogId.should.deep.equal(NotificationLogId.decode(previousId))
      log = factory.createNotificationLog(log.decodedPreviousNotificationLogId());

      let nextId = log.nextNotificationLogId;
      let decodedNextLogId = log.decodedNextNotificationLogId();
      decodedNextLogId.should.deep.equal(NotificationLogId.decode(nextId))
      decodedCurrentLogId.should.deep.equal(decodedNextLogId)
  })
})
