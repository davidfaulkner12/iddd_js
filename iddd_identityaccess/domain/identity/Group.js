const _ = require("underscore")

const ConcurrencySafeEntity = require("../../common/domain/ConcurrencySafeEntity")
const DomainEventPublisher = require("../../common/domain/DomainEventPublisher")

const GroupMemberType = require("./GroupMemberType")
const
  GroupMember = require("./GroupMember")


class Group extends ConcurrencySafeEntity {

  get ROLE_GROUP_PREFIX() {
    return "ROLE-INTERNAL-GROUP: "
  }

  constructor(aTenantId, aName, aDescription) {
    super()

    this.description = aDescription
    this.name = aName
    this.tenantId = aTenantId
    this.groupMembers = []
  }

  addUser(aUser) {
    this.assertArgumentNotNull(aUser, "User must not be null.");
    this.assertArgumentEquals(this.tenantId, aUser.tenantId, "Wrong tenant for this group.");
    this.assertArgumentTrue(aUser.enabled, "User is not enabled.");

    if (this.groupMembers.push(aUser.toGroupMember()) && !this.isInternalGroup()) {
      DomainEventPublisher
        .publish("GroupUserAdded", {
          tenantId: this.tenantId,
          name: this.name,
          username: aUser.username
        })
    }
  }


  addGroup(aGroup, aGroupMemberService) {
    this.assertArgumentNotNull(aGroup, "Group must not be null.");
    this.assertArgumentEquals(this.tenantId, aGroup.tenantId, "Wrong tenant for this group.");
    this.assertArgumentFalse(aGroupMemberService.isMemberGroup(aGroup, this.toGroupMember()), "Group recursion.");

    this.groupMembers.push(aGroup.toGroupMember())
    if (!this.isInternalGroup()) {
      DomainEventPublisher
        .publish("GroupGroupAdded", {
          tenantId: this.tenantId,
          name: this.name,
          groupName: aGroup.name
        })
    }
  }

  toGroupMember() {
    let groupMember =
      new GroupMember(
        this.tenantId,
        this.name,
        GroupMemberType.GROUP);

    return groupMember;
  }

  isMember(aUser, aGroupMemberService) {
    this.assertArgumentNotNull(aUser, "User must not be null.");
    this.assertArgumentEquals(this.tenantId, aUser.tenantId, "Wrong tenant for this group.");
    this.assertArgumentTrue(aUser.enabled, "User is not enabled.");

    let isMember = _.find(this.groupMembers, (member) => {
      return _.isEqual(member, aUser.toGroupMember())
    })


    if (isMember) {
      isMember = aGroupMemberService.confirmUser(this, aUser);
    } else {
      isMember = aGroupMemberService.isUserInNestedGroup(this, aUser);
    }

    return isMember;
  }

  removeGroup(aGroup) {
    this.assertArgumentNotNull(aGroup, "Group must not be null.");
    this.assertArgumentEquals(this.tenantId, aGroup.tenantId, "Wrong tenant for this group.");

    let oldLength = this.groupMembers.length

    this.groupMembers = _.reject(this.groupMembers, (member) => {
      return _.isEqual(member, aGroup.toGroupMember())
    })
    
    // not a nested remove, only direct member
    if (this.groupMembers.length != oldLength && !this.isInternalGroup()) {

      DomainEventPublisher.publish("GroupGroupRemoved", {
        tenantId: this.tenantId,
        name: this.name,
        groupName: aGroup.name
      })
    }
  }

  removeUser(aUser) {
    this.assertArgumentNotNull(aUser, "User must not be null.");
    this.assertArgumentEquals(this.tenantId, aUser.tenantId, "Wrong tenant for this group.");

    let oldLength = this.groupMembers.length

    this.groupMembers = _.reject(this.groupMembers, (member) => {
      return _.isEqual(member, aUser.toGroupMember())
    })

    // not a nested remove, only direct member
    if (this.groupMembers.length != oldLength && !this.isInternalGroup()) {

      DomainEventPublisher.publish("GroupUserRemoved", {
        tenantId: this.tenantId,
        name: this.name,
        username: aUser.username
      })
    }
  }

  isInternalGroup(aName) {
    if (!aName) {
      aName = this.name
    }
    return aName.startsWith(this.ROLE_GROUP_PREFIX)
  }


  set description(aDescription) {
    this.assertArgumentNotEmpty(aDescription, "Group description is required.")
    this.assertArgumentLength(aDescription, 1, 250, "Group description must be 250 characters or less.")

    this._description = aDescription
  }

  get description() {
    return this._description
  }


  set tenantId(aTenantId) {
    this.assertArgumentNotNull(aTenantId, "The tenantId must be provided.");

    this._tenantId = aTenantId;
  }


  get tenantId() {
    return this._tenantId
  }

  set name(aName) {
    this.assertArgumentNotEmpty(aName, "Group name is required.")
    this.assertArgumentLength(aName, 1, 100, "Group name must be 100 characters or less.")

    if (this.isInternalGroup(aName)) {
      let uuid = aName.substring(this.ROLE_GROUP_PREFIX.length)
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
        throw new Error("IllegalArgument: The id has an invalid format.")
      }

    }

    this._name = aName;
  }

  get name() {
    return this._name
  }



}
module.exports = Group

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

package com.saasovation.identityaccess.domain.model.identity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.saasovation.common.domain.model.ConcurrencySafeEntity;
import com.saasovation.common.domain.model.DomainEventPublisher;

public class Group extends ConcurrencySafeEntity {

    private String description;
    private Set<GroupMember> groupMembers;
    private String name;
    private TenantId tenantId;





    public boolean isMember(User aUser, GroupMemberService aGroupMemberService) {
        this.assertArgumentNotNull(aUser, "User must not be null.");
        this.assertArgumentEquals(this.tenantId(), aUser.tenantId(), "Wrong tenant for this group.");
        this.assertArgumentTrue(aUser.isEnabled(), "User is not enabled.");

        boolean isMember =
            this.groupMembers().contains(aUser.toGroupMember());

        if (isMember) {
            isMember = aGroupMemberService.confirmUser(this, aUser);
        } else {
            isMember = aGroupMemberService.isUserInNestedGroup(this, aUser);
        }

        return isMember;
    }


    public void removeGroup(Group aGroup) {
        this.assertArgumentNotNull(aGroup, "Group must not be null.");
        this.assertArgumentEquals(this.tenantId(), aGroup.tenantId(), "Wrong tenant for this group.");

        // not a nested remove, only direct member
        if (this.groupMembers().remove(aGroup.toGroupMember()) && !this.isInternalGroup()) {
            DomainEventPublisher
                .instance()
                .publish(new GroupGroupRemoved(
                        this.tenantId(),
                        this.name(),
                        aGroup.name()));
        }
    }

    public void removeUser(User aUser) {
        this.assertArgumentNotNull(aUser, "User must not be null.");
        this.assertArgumentEquals(this.tenantId(), aUser.tenantId(), "Wrong tenant for this group.");

        // not a nested remove, only direct member
        if (this.groupMembers().remove(aUser.toGroupMember()) && !this.isInternalGroup()) {
            DomainEventPublisher
                .instance()
                .publish(new GroupUserRemoved(
                        this.tenantId(),
                        this.name(),
                        aUser.username()));
        }
    }



    protected GroupMember toGroupMember() {
        GroupMember groupMember =
            new GroupMember(
                    this.tenantId(),
                    this.name(),
                    GroupMemberType.Group);

        return groupMember;
    }
}
*/
