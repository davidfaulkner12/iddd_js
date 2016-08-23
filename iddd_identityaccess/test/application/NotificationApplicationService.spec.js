/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
chai.should()

const {
  NotificationLogFactory,
  NotificationLogId
} = require("../../common/notification/Notifications")

const ApplicationServiceRegistry =
  require("../../application/ApplicationServiceRegistry")

describe("NotificationApplicationService", function() {
  beforeEach(function() {
    this.notificationApplicationService =
      ApplicationServiceRegistry
      .notificationApplicationService

    this.eventStore = this.notificationApplicationService.eventStore

    this.notificationPublisher =
      this.notificationApplicationService.notificationPublisher

    for (let idx = 1; idx <= 31; ++idx) {
      this.eventStore.append("TestableDomainEvent", {
        id: idx,
        name: "Event: " + idx,
        eventVersion: 1,
        occurredOn: new Date()
      })
    }
  })

  afterEach(function() {
    this.eventStore.clean()
      // TODO Clean up notification publisher?
    this.notificationPublisher.confirmed = false
  })

  it("CurrentNotificationLog", function() {
    let log =
      this.notificationApplicationService.currentNotificationLog()

    NotificationLogFactory.notificationsPerLog().should.be.at.least(
      log.totalNotifications())
    this.eventStore.countStoredEvents().should.be.at.least(
      log.totalNotifications())
    log.hasNextNotificationLog().should.be.false
    log.hasPreviousNotificationLog().should.be.true
    log.isArchived().should.be.false
  })

  it("NotificationLog", function() {
    let id = NotificationLogId.first(
      NotificationLogFactory.notificationsPerLog())

    let log = this.notificationApplicationService.notificationLog(id.encoded())

    NotificationLogFactory.notificationsPerLog().should.equal(
      log.totalNotifications())
    this.eventStore.countStoredEvents().should.be.at.least(
      log.totalNotifications())
    log.hasNextNotificationLog().should.be.true
    log.hasPreviousNotificationLog().should.be.false
    log.isArchived().should.be.true
  })

  it("PublishNotifications", function() {
    this.notificationApplicationService.publishNotifications()

    this.notificationPublisher.internalOnlyTestConfirmation().should.be.true
  })
})
