import { ListAdminsUseCase } from '$/packages/application/usecase/admin/admins/list';
import { TestAdminRepository, getDummyAdminData } from '$/__tests__/__mocks__/infra/database/admin';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getQuery } from '$/__tests__/utils';

describe('ListAdminUseCase', () => {
  it('should list admins', async() => {
    expect(await (new ListAdminsUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute(getQuery({
      filters: {
        roles: ['a', 'b'],
        name: 'c',
      },
      orderBy: 'name',
    }))).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
            id: 1,
            email: expect.any(String),
            name: expect.any(String),
            password: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      },
    });
  });

  it('should list admins', async() => {
    expect(await (new ListAdminsUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute({
      filters: [
        { column: { field: 'name' }, value: 'c', operator: '=' },
      ],
      page: 1,
      pageSize: 10,
      totalCount: 100,
      search: 'test',
      orderBy: {
        field: 'name',
      },
      orderDirection: 'asc',
    })).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
            id: 1,
            email: expect.any(String),
            name: expect.any(String),
            password: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      },
    });
  });

  it('should list admins', async() => {
    expect(await (new ListAdminsUseCase(new TestAdminRepository([getDummyAdminData()]), new ResponseRepository())).execute({
      filters: [],
      page: 1,
      pageSize: 10,
      totalCount: 100,
      search: 'test',
      orderBy: {
        field: 'name',
      },
      orderDirection: 'asc',
    })).toEqual({
      status: 200,
      body: {
        page: 0,
        totalCount: 1,
        data: [
          {
            id: 1,
            email: expect.any(String),
            name: expect.any(String),
            password: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      },
    });
  });
});
