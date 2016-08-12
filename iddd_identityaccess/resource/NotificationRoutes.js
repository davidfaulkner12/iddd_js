const ApplicationServiceRegistry = require("../application/ApplicationServiceRegistry")

const {
  NotificationLogRepresentation
} = require("../application/representation/NotificationRepresentations")

const Serializer = require("./Serializer")

const getNotifications = (request, reply) => {

  let currentNotificationLog =
    ApplicationServiceRegistry.notificationApplicationService
    .currentNotificationLog()

  if (currentNotificationLog) {
    let response = notificationLogResponse(
      currentNotificationLog, request, true)
    reply(response).type("application/json")
  } else {
    reply().code(404)
  }

}

const getNotificationsForId = (request, reply) => {
  let notificationLogId = request.params.notificationLogId

  let notificationLog = ApplicationServiceRegistry.notificationApplicationService
    .notificationLog(notificationLogId)

  if (notificationLog) {
    let response = notificationLogResponse(notificationLog, request, false)
    reply(response).type("application/json")
  } else {
    reply().code(404)
  }
}

function notificationLogResponse(notificationLog, request, current) {

  let log =
    new NotificationLogRepresentation(notificationLog)

  log.selfLink =
    linkFor(notificationLog.notificationLogId, request)

  log.previousLink =
    linkFor(notificationLog.previousNotificationLogId, request)

  if (!current && notificationLog.nextNotificationLogId != null) {
    log.nextLink =
      linkFor(notificationLog.nextNotificationLogId, request)
  }

  response = Serializer.generateExternalRepresentation(log)

  return response
}

function linkFor(anId,request) {

  let protocol = request.headers['x-forwarded-proto'] || request.connection.info.protocol
  let host = request.info.host
  let basePath = "notifications"

  let url = `${protocol}://${host}/${basePath}/${encodeURIComponent(anId)}`;

  return url;
}

module.exports = [{
  method: 'GET',
  path: '/notifications',
  handler: getNotifications
},{
  method: "GET",
  path: '/notifications/{notificationLogId}',
  handler: getNotificationsForId
}]
