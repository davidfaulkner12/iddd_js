const PasswordService = require("./identity/PasswordService")

const TenantRepository = require("./identity/TenantRepository")
const UserRepository = require("./identity/UserRepository")
const RoleRepository = require("./access/RoleRepository")
const GroupRepository = require("./identity/GroupRepository")

const TenantProvisioningService = require("./identity/TenantProvisioningService")
const GroupMemberService = require("./identity/GroupMemberService")

let tenantRepository = new TenantRepository()
let userRepository = new UserRepository()
let roleRepository = new RoleRepository()
let groupRepository = new GroupRepository()

let passwordService = new PasswordService()

module.exports.passwordService = passwordService

module.exports.tenantRepository = tenantRepository

module.exports.userRepository = userRepository

module.exports.roleRepository = roleRepository

module.exports.groupRepository = groupRepository

module.exports.tenantProvisioningService = new TenantProvisioningService(tenantRepository, userRepository, roleRepository)
module.exports.groupMemberService = new GroupMemberService(userRepository, groupRepository)
