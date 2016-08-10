const DomainRegistry = require("../domain/DomainRegistry")

const EventStore = require("../common/event/EventStore")


const AccessApplicationService = require("./AccessApplicationService")
const IdentityApplicationService = require("./IdentityApplicationService")
const NotificationApplicationService = require("./NotificationApplicationService")


let eventStore = new EventStore()

// TODO Not even going to create a fake module for this mock
let notificationPublisher = {
  confirmed: true,
  publishNotifications: () => {
    this.confirmed = true
  },
  internalOnlyTestConfirmation: () => {
    return this.confirmed
  }
}

module.exports.accessApplicationService = new AccessApplicationService(DomainRegistry.groupRepository, DomainRegistry.roleRepository, DomainRegistry.tenantRepository, DomainRegistry.userRepository)

module.exports.identityApplicationService = new IdentityApplicationService(
  DomainRegistry.authenticationService,
  DomainRegistry.groupMemberService,
  DomainRegistry.groupRepository,
  DomainRegistry.tenantProvisioningService,
  DomainRegistry.tenantRepository,
  DomainRegistry.userRepository
)

module.exports.notificationApplicationService = new NotificationApplicationService(eventStore, notificationPublisher)
