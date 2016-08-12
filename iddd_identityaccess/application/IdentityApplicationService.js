const {
  TenantId,
  ContactInformation,
  EmailAddress,
  PostalAddress,
  Telephone,
  FullName,
  Enablement
} = require("../domain/identity/IdentityValueObjects")
const Person = require("../domain/identity/Person")

class IdentityApplicationService {

  constructor(
    authenticationService,
    groupMemberService,
    groupRepository,
    tenantProvisioningService,
    tenantRepository,
    userRepository) {
    this.authenticationService = authenticationService
    this.groupMemberService = groupMemberService
    this.groupRepository = groupRepository
    this.tenantProvisioningService = tenantProvisioningService
    this.tenantRepository = tenantRepository
    this.userRepository = userRepository
  }

  activateTenant(aCommand) {
    let tenant = this._existingTenant(aCommand.tenantId);

    tenant.activate();
  }

  deactivateTenant(aCommand) {
    let tenant = this._existingTenant(aCommand.tenantId);

    tenant.deactivate();
  }

  addGroupToGroup(aCommand) {
    let parentGroup =
      this._existingGroup(
        aCommand.tenantId,
        aCommand.parentGroupName);

    let childGroup =
      this._existingGroup(
        aCommand.tenantId,
        aCommand.childGroupName);

    parentGroup.addGroup(childGroup, this.groupMemberService);
  }


  addUserToGroup(aCommand) {
    let group =
      this._existingGroup(
        aCommand.tenantId,
        aCommand.groupName);

    let user =
      this._existingUser(
        aCommand.tenantId,
        aCommand.username);

    group.addUser(user);
  }



  authenticateUser(aCommand) {
    let userDescriptor =
      this.authenticationService
      .authenticate(
        new TenantId(aCommand.tenantId),
        aCommand.username,
        aCommand.password);

    return userDescriptor;
  }

  changeUserContactInformation(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    this._internalChangeUserContactInformation(
      user,
      new ContactInformation(
        new EmailAddress(aCommand.emailAddress),
        new PostalAddress(
          aCommand.addressStreetAddress,
          aCommand.addressCity,
          aCommand.addressStateProvince,
          aCommand.addressPostalCode,
          aCommand.addressCountryCode),
        new Telephone(aCommand.primaryTelephone),
        new Telephone(aCommand.secondaryTelephone)));
  }


  changeUserEmailAddress(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    this._internalChangeUserContactInformation(
      user,
      user.person
      .contactInformation
      .changeEmailAddress(new EmailAddress(aCommand.emailAddress)));
  }


  changeUserPostalAddress(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    this._internalChangeUserContactInformation(
      user,
      user.person
      .contactInformation
      .changePostalAddress(
        new PostalAddress(
          aCommand.addressStreetAddress,
          aCommand.addressCity,
          aCommand.addressStateProvince,
          aCommand.addressPostalCode,
          aCommand.addressCountryCode)));
  }


  changeUserPrimaryTelephone(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    this._internalChangeUserContactInformation(
      user,
      user.person
      .contactInformation
      .changePrimaryTelephone(new Telephone(aCommand.telephone)));
  }


  changeUserSecondaryTelephone(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    this._internalChangeUserContactInformation(
      user,
      user.person
      .contactInformation
      .changeSecondaryTelephone(new Telephone(aCommand.telephone)));
  }


  changeUserPassword(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    user.changePassword(aCommand.currentPassword, aCommand.changedPassword);
  }


  changeUserPersonalName(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    user.person.changeName(new FullName(aCommand.firstName, aCommand.lastName));
  }


  defineUserEnablement(aCommand) {
    let user = this._existingUser(aCommand.tenantId, aCommand.username);

    user.defineEnablement(
      new Enablement(
        aCommand.enabled,
        aCommand.startDate,
        aCommand.endDate));
  }



  userDescriptor(
    aTenantId,
    aUsername) {

    let userDescriptor = null;

    let user = this.user(aTenantId, aUsername);

    if (user != null) {
      userDescriptor = user.userDescriptor;
    }

    return userDescriptor;
  }



  isGroupMember(aTenantId, aGroupName, aUsername) {
    let group =
      this._existingGroup(
        aTenantId,
        aGroupName);

    let user =
      this._existingUser(
        aTenantId,
        aUsername);

    return group.isMember(user, this.groupMemberService);
  }


  provisionGroup(aCommand) {
    let tenant = this._existingTenant(aCommand.tenantId);

    let group =
      tenant.provisionGroup(
        aCommand.GroupName,
        aCommand.Description);

    this.groupRepository.add(group);

    return group;
  }


  provisionTenant(aCommand) {
    return this.tenantProvisioningService.provisionTenant(
      aCommand.tenantName,
      aCommand.tenantDescription,
      new FullName(
        aCommand.administorFirstName,
        aCommand.administorLastName),
      new EmailAddress(aCommand.emailAddress),
      new PostalAddress(
        aCommand.addressStateProvince,
        aCommand.addressCity,
        aCommand.addressStateProvince,
        aCommand.addressPostalCode,
        aCommand.addressCountryCode),
      new Telephone(aCommand.primaryTelephone),
      new Telephone(aCommand.secondaryTelephone));
  }


  registerUser(aCommand) {
    let tenant = this._existingTenant(aCommand.tenantId);

    let user =
      tenant.registerUser(
        aCommand.invitationIdentifier,
        aCommand.username,
        aCommand.password,
        new Enablement(
          aCommand.enabled,
          aCommand.StartDate,
          aCommand.EndDate),
        new Person(
          new TenantId(aCommand.tenantId),
          new FullName(aCommand.firstName, aCommand.lastName),
          new ContactInformation(
            new EmailAddress(aCommand.emailAddress),
            new PostalAddress(
              aCommand.addressStateProvince,
              aCommand.addressCity,
              aCommand.addressStateProvince,
              aCommand.addressPostalCode,
              aCommand.addressCountryCode),
            new Telephone(aCommand.primaryTelephone),
            new Telephone(aCommand.secondaryTelephone))));

    if (user == null) {
      throw new Error("IllegalState: User not registered.");
    }

    this.userRepository.add(user);

    return user;
  }


  removeGroupFromGroup(aCommand) {
    let parentGroup =
      this._existingGroup(
        aCommand.tenantId,
        aCommand.parentGroupName);

    let childGroup =
      this._existingGroup(
        aCommand.tenantId,
        aCommand.childGroupName);

    parentGroup.removeGroup(childGroup);
  }


  removeUserFromGroup(aCommand) {
    let group =
      this._existingGroup(
        aCommand.tenantId,
        aCommand.groupName);

    let user =
      this._existingUser(
        aCommand.tenantId,
        aCommand.username);

    group.removeUser(user);
  }




  tenant(aTenantId) {
    let tenant =
      this.tenantRepository
      .tenantOfId(new TenantId(aTenantId));

    return tenant;
  }

  _existingTenant(aTenantId) {
    let tenant = this.tenant(aTenantId);

    if (tenant == null) {
      throw new Error(
        "Illegal agrument Tenant does not exist for: " + aTenantId);
    }

    return tenant;
  }

  group(aTenantId, aGroupName) {
    let group =
      this.groupRepository
      .groupNamed(new TenantId(aTenantId), aGroupName);

    return group;
  }

  _existingGroup(aTenantId, aGroupName) {
    let group = this.group(aTenantId, aGroupName);

    if (group == null) {
      throw new Error(
        "IllegalArgument: Group does not exist for: " +
        aTenantId + " and: " + aGroupName);
    }

    return group;
  }

  user(aTenantId, aUsername) {
    let user =
      this.userRepository
      .userWithUsername(
        new TenantId(aTenantId),
        aUsername);

    return user;
  }

  _existingUser(aTenantId, aUsername) {
    let user = this.user(aTenantId, aUsername);

    if (user == null) {
      throw new Error(
        "IllegalArgumetn: User does not exist for: " +
        aTenantId + " and " + aUsername);
    }

    return user;
  }



  _internalChangeUserContactInformation(
    aUser,
    aContactInformation) {

    if (aUser == null) {
      throw new Error("IllegalArgument: User must exist.");
    }

    aUser.person.changeContactInformation(aContactInformation);
  }


}

module.exports = IdentityApplicationService

/*



  }
  */
