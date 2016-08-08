const PasswordService = require("./identity/PasswordService")

const TenantRepository = require("./identity/TenantRepository")
const UserRepository = require("./identity/UserRepository")
const RoleRepository = require("./access/RoleRepository")

const TenantProvisioningService = require("./identity/TenantProvisioningService")


let tenantRepository = new TenantRepository()
let userRepository = new UserRepository()
let roleRepository = new RoleRepository()

let passwordService = new PasswordService()

module.exports.passwordService = passwordService

module.exports.tenantRepository = tenantRepository

module.exports.userRepository = userRepository

module.exports.roleRepository = roleRepository

module.exports.tenantProvisioningService = new TenantProvisioningService(tenantRepository, userRepository, roleRepository)
