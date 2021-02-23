/* istanbul ignore file */

import type {
  IRoleRepository,
  Role,
} from '$/packages/domain/database/role';

export class TestRoleRepository implements IRoleRepository {
  public constructor(private store: Role[] = []) {
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }

  list(): Promise<Role[]> {
    return Promise.resolve(this.store);
  }
}

export const roleRepository = new TestRoleRepository();
