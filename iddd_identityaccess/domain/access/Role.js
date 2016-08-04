const Group = require("../identity/Group")
const ConcurrencySafeEntity = require("../../common/domain/ConcurrencySafeEntity")

const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")


const uuid = require("uuid")

class Role extends ConcurrencySafeEntity {
  constructor(
    aTenantId,
    aName,
    aDescription,
    aSupportsNesting = false) {

    super()

    this.description = aDescription
    this.name = aName
    this.supportsnesting = aSupportsNesting
    this.tenantId = aTenantId

    this.createInternalGroup()
  }

  assignUser(aUser) {
    this.assertArgumentNotNull(aUser, "User must not be null.")
    this.assertArgumentEquals(this.tenantId, aUser.tenantId, "Wrong tenant for this user.")

    this.group.addUser(aUser);

    // NOTE: Consider what a consuming Bounded Context would
    // need to do if this event was not enriched with the
    // last three user person properties. (Hint: A lot.)
    DomainEventPublisher
      .publish("UserAssignedToRole", {
        tenantId: this.tenantId,
        name: this.name,
        username: aUser.username,
        firstName: aUser.person.name.firstName,
        lastName: aUser.person.name.lastName,
        emailAddress: aUser.person.emailAddress.address
      })
  }


  createInternalGroup() {
    let groupName =
      Group.ROLE_GROUP_PREFIX +
      uuid.v4();

    this.group = new Group(
      this.tenantId,
      groupName,
      "Role backing group for: " + this.name)
  }

  set description(aDescription) {
    this.assertArgumentNotEmpty(aDescription, "Role description is required.")
    this.assertArgumentLength(aDescription, 1, 250, "Role description must be 250 characters or less.")

    this._description = aDescription;
  }


  get description() {
    return this._description;
  }


  set name(aName) {
    this.assertArgumentNotEmpty(aName, "Role name must be provided.");
    this.assertArgumentLength(aName, 1, 250, "Role name must be 100 characters or less.");

    this._name = aName;
  }

  get name() {
    return this._name
  }


  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId is required.");

    this._tenantId = aTenantId;
  }


  get tenantId() {
    return this._tenantId;
  }
}

module.exports = Role

/*
//   Copyright 2012,2013 Vaughn Vernon
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

package com.saasovation.identityaccess.domain.model.access;

import java.util.UUID;

import com.saasovation.common.domain.model.ConcurrencySafeEntity;
import com.saasovation.common.domain.model.DomainEventPublisher;
import com.saasovation.identityaccess.domain.model.identity.Group;
import com.saasovation.identityaccess.domain.model.identity.GroupMemberService;
import com.saasovation.identityaccess.domain.model.identity.TenantId;
import com.saasovation.identityaccess.domain.model.identity.User;

public class Role extends ConcurrencySafeEntity {

    private static final long serialVersionUID = 1L;

    private String description;
    private Group group;
    private String name;
    private boolean supportsNesting = true;
    private TenantId tenantId;


    public void assignGroup(Group aGroup, GroupMemberService aGroupMemberService) {
        this.assertStateTrue(this.supportsNesting(), "This role does not support group nesting.");
        this.assertArgumentNotNull(aGroup, "Group must not be null.");
        this.assertArgumentEquals(this.tenantId(), aGroup.tenantId(), "Wrong tenant for this group.");

        this.group().addGroup(aGroup, aGroupMemberService);

        DomainEventPublisher
            .instance()
            .publish(new GroupAssignedToRole(
                    this.tenantId(),
                    this.name(),
                    aGroup.name()));
    }

    public void assignUser(User aUser) {
        this.assertArgumentNotNull(aUser, "User must not be null.");
        this.assertArgumentEquals(this.tenantId(), aUser.tenantId(), "Wrong tenant for this user.");

        this.group().addUser(aUser);

        // NOTE: Consider what a consuming Bounded Context would
        // need to do if this event was not enriched with the
        // last three user person properties. (Hint: A lot.)
        DomainEventPublisher
            .instance()
            .publish(new UserAssignedToRole(
                    this.tenantId(),
                    this.name(),
                    aUser.username(),
                    aUser.person().name().firstName(),
                    aUser.person().name().lastName(),
                    aUser.person().emailAddress().address()));
    }



    public boolean isInRole(User aUser, GroupMemberService aGroupMemberService) {
        return this.group().isMember(aUser, aGroupMemberService);
    }


    public void unassignGroup(Group aGroup) {
        this.assertStateTrue(this.supportsNesting(), "This role does not support group nesting.");
        this.assertArgumentNotNull(aGroup, "Group must not be null.");
        this.assertArgumentEquals(this.tenantId(), aGroup.tenantId(), "Wrong tenant for this group.");

        this.group().removeGroup(aGroup);

        DomainEventPublisher
            .instance()
            .publish(new GroupUnassignedFromRole(
                    this.tenantId(),
                    this.name(),
                    aGroup.name()));
    }

    public void unassignUser(User aUser) {
        this.assertArgumentNotNull(aUser, "User must not be null.");
        this.assertArgumentEquals(this.tenantId(), aUser.tenantId(), "Wrong tenant for this user.");

        this.group().removeUser(aUser);

        DomainEventPublisher
            .instance()
            .publish(new UserUnassignedFromRole(
                    this.tenantId(),
                    this.name(),
                    aUser.username()));
    }




}
*/
