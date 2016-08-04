const InMemoryRepository = require("../identity/InMemoryRepository")

class RoleRepository extends InMemoryRepository {

  constructor() {
    super()
  }

  keyOf(aRole) {
    return aRole.tenantId + "#" + aRole.name
  }
}

module.exports = RoleRepository
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

  package com.saasovation.identityaccess.infrastructure.persistence;

  import java.util.ArrayList;
  import java.util.Collection;
  import java.util.HashMap;
  import java.util.Map;

  import com.saasovation.common.persistence.CleanableStore;
  import com.saasovation.identityaccess.domain.model.access.Role;
  import com.saasovation.identityaccess.domain.model.access.RoleRepository;
  import com.saasovation.identityaccess.domain.model.identity.TenantId;

  public class InMemoryRoleRepository implements RoleRepository, CleanableStore {

      @Override
      public Collection<Role> allRoles(TenantId aTenantId) {
          Collection<Role> roles = new ArrayList<Role>();

          for (Role role : this.repository().values()) {
              if (role.tenantId().equals(aTenantId)) {
                  roles.add(role);
              }
          }

          return roles;
      }

      @Override
      public Role roleNamed(TenantId aTenantId, String aRoleName) {
          return this.repository().get(this.keyOf(aTenantId, aRoleName));
      }


  }
  */
