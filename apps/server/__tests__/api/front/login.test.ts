import controller from '$/api/front/login/controller';
import { verifyCode } from '$/service/auth0';
import { getGuests, createGuest, updateGuest, deleteGuests } from '$/repositories/guest';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { login } from '$/domains/front/login';

describe('login', () => {
  it('should return status 401 if failed to verify code', async() => {
    const injectedController = controller.inject({
      login: login.inject({
        verifyCode: verifyCode.inject({
          fetch: () => getPromiseLikeItem({
            ok: false,
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: { accessToken: '123' },
    });
    expect(res.status).toBe(401);
  });

  it('should create new guest', async() => {
    const getGuestsMock = jest.fn(() => getPromiseLikeItem([]));
    const createGuestMock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const injectedController = controller.inject({
      login: login.inject({
        verifyCode: verifyCode.inject({
          fetch: () => getPromiseLikeItem({
            ok: true,
            json: () => ({
              email: 'test@example.com',
              sub: 'test',
            }),
          }),
        }),
        getGuests: getGuests.inject({
          prisma: { guest: { findMany: getGuestsMock } },
        }),
        createGuest: createGuest.inject({
          prisma: { guest: { create: createGuestMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: { accessToken: '123' },
    });
    expect(res.status).toBe(204);
    expect(res.headers).toEqual({ authorization: JSON.stringify({ id: 123 }) });
    expect(getGuestsMock).toBeCalledWith({
      where: {
        OR: [
          { email: 'test@example.com' },
          { auth0Sub: 'test' },
        ],
      },
    });
    expect(createGuestMock).toBeCalledWith({
      data: {
        email: 'test@example.com',
        auth0Sub: 'test',
      },
    });
  });

  it('should update guest', async() => {
    const getGuestsMock = jest.fn(() => getPromiseLikeItem([{
      id: 123,
    }]));
    const updateGuestMock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const deleteGuestsMock = jest.fn(() => getPromiseLikeItem({ count: 0 }));
    const injectedController = controller.inject({
      login: login.inject({
        verifyCode: verifyCode.inject({
          fetch: () => getPromiseLikeItem({
            ok: true,
            json: () => ({
              email: 'test@example.com',
              sub: 'test',
            }),
          }),
        }),
        getGuests: getGuests.inject({
          prisma: { guest: { findMany: getGuestsMock } },
        }),
        updateGuest: updateGuest.inject({
          prisma: { guest: { update: updateGuestMock } },
        }),
        deleteGuests: deleteGuests.inject({
          prisma: { guest: { deleteMany: deleteGuestsMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: { accessToken: '123' },
    });
    expect(res.status).toBe(204);
    expect(res.headers).toEqual({ authorization: JSON.stringify({ id: 123 }) });
    expect(getGuestsMock).toBeCalledWith({
      where: {
        OR: [
          { email: 'test@example.com' },
          { auth0Sub: 'test' },
        ],
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        email: 'test@example.com',
        auth0Sub: 'test',
      },
      where: {
        id: 123,
      },
    });
    expect(deleteGuestsMock).not.toBeCalled();
  });

  it('should update guest', async() => {
    const getGuestsMock = jest.fn(() => getPromiseLikeItem([
      { id: 123, test1: 'test1-1', test2: undefined, test3: undefined },
      { id: 2, test1: 'test2-1', test2: 'test2-2' },
      { id: 3, test1: 'test3-1', test2: undefined, test3: 'test3-3' },
    ]));
    const updateGuestMock = jest.fn(() => getPromiseLikeItem({ id: 123 }));
    const deleteGuestsMock = jest.fn(() => getPromiseLikeItem({ count: 2 }));
    const injectedController = controller.inject({
      login: login.inject({
        verifyCode: verifyCode.inject({
          fetch: () => getPromiseLikeItem({
            ok: true,
            json: () => ({
              email: 'test@example.com',
              sub: 'test',
            }),
          }),
        }),
        getGuests: getGuests.inject({
          prisma: { guest: { findMany: getGuestsMock } },
        }),
        updateGuest: updateGuest.inject({
          prisma: { guest: { update: updateGuestMock } },
        }),
        deleteGuests: deleteGuests.inject({
          prisma: { guest: { deleteMany: deleteGuestsMock } },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: { accessToken: '123' },
    });
    expect(res.status).toBe(204);
    expect(res.headers).toEqual({ authorization: JSON.stringify({ id: 123 }) });
    expect(getGuestsMock).toBeCalledWith({
      where: {
        OR: [
          { email: 'test@example.com' },
          { auth0Sub: 'test' },
        ],
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        test1: 'test1-1',
        test2: 'test2-2',
        test3: 'test3-3',
        email: 'test@example.com',
        auth0Sub: 'test',
      },
      where: {
        id: 123,
      },
    });
    expect(deleteGuestsMock).toBeCalledWith({
      where: {
        OR: [
          { id: 2 },
          { id: 3 },
        ],
      },
    });
  });
});
