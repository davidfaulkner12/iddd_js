const PasswordService = require("./identity/PasswordService")
const EncryptionService = require("./identity/EncryptionService")

const TenantRepository = require("./identity/TenantRepository")
const UserRepository = require("./identity/UserRepository")
const RoleRepository = require("./access/RoleRepository")
const GroupRepository = require("./identity/GroupRepository")

const encryptionService = new EncryptionService()

const TenantProvisioningService = require("./identity/TenantProvisioningService")
const GroupMemberService = require("./identity/GroupMemberService")
const AuthenticationService = require("./identity/AuthenticationService")
const AuthorizationService = require("./access/AuthorizationService")

let tenantRepository = new TenantRepository()
let userRepository = new UserRepository()
let roleRepository = new RoleRepository()
let groupRepository = new GroupRepository()

let passwordService = new PasswordService()

module.exports.passwordService = passwordService
module.exports.encryptionService = encryptionService

module.exports.tenantRepository = tenantRepository

module.exports.userRepository = userRepository

module.exports.roleRepository = roleRepository

module.exports.groupRepository = groupRepository

module.exports.tenantProvisioningService = new TenantProvisioningService(tenantRepository, userRepository, roleRepository)
module.exports.groupMemberService = new GroupMemberService(userRepository, groupRepository)
module.exports.authenticationService = new AuthenticationService(tenantRepository, userRepository, encryptionService)
module.exports.authorizationService = new AuthorizationService(userRepository, groupRepository, roleRepository)
