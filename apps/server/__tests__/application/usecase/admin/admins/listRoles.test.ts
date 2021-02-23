import { ListRolesUseCase } from '$/application/usecase/admin/admins/listRoles';
import { TestRoleRepository } from '$/__tests__/__mocks__/infra/database/role';
import { ResponseRepository } from '$/infra/http/response';

describe('ListRolesUseCase', () => {
  it('should list roles', async() => {
    expect(await (new ListRolesUseCase(new TestRoleRepository([
      { role: 'a', name: 'A' },
      { role: 'b', name: 'B' },
      { role: 'c', name: 'C' },
    ]), new ResponseRepository())).execute()).toEqual({
      status: 200,
      body: { a: 'A', b: 'B', c: 'C' },
    });
  });
});
