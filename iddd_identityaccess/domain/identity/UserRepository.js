const InMemoryRepository = require("./InMemoryRepository")

class UserRepository extends InMemoryRepository {
  super() {
    this()
  }


  keyOf(aUser) {
    return aUser.tenantId + "#" + aUser.username;
  }
}

module.exports = UserRepository

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
import com.saasovation.identityaccess.domain.model.identity.FullName;
import com.saasovation.identityaccess.domain.model.identity.TenantId;
import com.saasovation.identityaccess.domain.model.identity.User;
import com.saasovation.identityaccess.domain.model.identity.UserRepository;

public class InMemoryUserRepository implements UserRepository, CleanableStore {

    @Override
    public Collection<User> allSimilarlyNamedUsers(
            TenantId aTenantId,
            String aFirstNamePrefix,
            String aLastNamePrefix) {

        Collection<User> users = new ArrayList<User>();

        aFirstNamePrefix = aFirstNamePrefix.toLowerCase();
        aLastNamePrefix = aLastNamePrefix.toLowerCase();

        for (User user : this.repository().values()) {
            if (user.tenantId().equals(aTenantId)) {
                FullName name = user.person().name();
                if (name.firstName().toLowerCase().startsWith(aFirstNamePrefix)) {
                    if (name.lastName().toLowerCase().startsWith(aLastNamePrefix)) {
                        users.add(user);
                    }
                }
            }
        }

        return users;
    }

    @Override
    public User userFromAuthenticCredentials(
            TenantId aTenantId,
            String aUsername,
            String anEncryptedPassword) {

        for (User user : this.repository().values()) {
            if (user.tenantId().equals(aTenantId)) {
                if (user.username().equals(aUsername)) {
                    if (user.internalAccessOnlyEncryptedPassword().equals(anEncryptedPassword)) {
                        return user;
                    }
                }
            }
        }

        return null;
    }

    @Override
    public User userWithUsername(TenantId aTenantId, String aUsername) {
        for (User user : this.repository().values()) {
            if (user.tenantId().equals(aTenantId)) {
                if (user.username().equals(aUsername)) {
                    return user;
                }
            }
        }

        return null;
    }

}
*/
