import { SearchRoleUseCase } from '$/application/usecase/admin/admins/searchRole';
import { TestRoleRepository } from '$/__tests__/__mocks__/infra/database/role';
import { ResponseRepository } from '$/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('SearchRoleUseCase', () => {
  it('should list roles', async() => {
    expect(await (new SearchRoleUseCase(new TestRoleRepository([
      { role: 'a', name: 'A' },
      { role: 'b', name: 'B' },
      { role: 'c', name: 'C' },
    ]), new ResponseRepository())).execute(getQuery({
      orderBy: 'name',
    }))).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 3,
        data: [
          { role: 'a', name: 'A' },
          { role: 'b', name: 'B' },
          { role: 'c', name: 'C' },
        ],
      },
    });
  });
});
