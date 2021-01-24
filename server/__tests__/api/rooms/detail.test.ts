import controller from '$/api/rooms/_roomId@number/controller';
import { getRoom, updateRoom, deleteRoom } from '$/repositories/room';
import { getFastify, getAuthorizationHeader, getPromiseLikeItem } from '$/__tests__/utils';
import { get, update, remove } from '$/domains/rooms';

describe('rooms/detail', () => {
  it('should get room', async() => {
    const getRoomMock        = jest.fn(() => getPromiseLikeItem({
      id: 123,
      name: 'test',
      number: 10,
      price: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const injectedController = controller.inject({
      get: get.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.get({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { roomId: 123 },
    });
    expect(res.body).toEqual(expect.objectContaining({
      id: 123,
      name: 'test',
      number: 10,
      price: 10000,
    }));
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 123,
      },
    });
  });

  it('should update room', async() => {
    const updateRoomMock     = jest.fn();
    const injectedController = controller.inject({
      update: update.inject({
        updateRoom: updateRoom.inject({
          prisma: {
            room: {
              update: updateRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.patch({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { roomId: 123 },
      body: {
        name: 'test',
        number: 10,
        price: 10000,
      },
    });
    expect(res.status).toBe(200);
    expect(updateRoomMock).toBeCalledWith({
      data: {
        name: 'test',
        number: 10,
        price: 10000,
      },
      where: {
        id: 123,
      },
    });
  });

  it('should delete room', async() => {
    const deleteRoomMock     = jest.fn();
    const injectedController = controller.inject({
      remove: remove.inject({
        deleteRoom: deleteRoom.inject({
          prisma: {
            room: {
              delete: deleteRoomMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.delete({
      headers: getAuthorizationHeader(1),
      user: { id: 1, roles: [] },
      params: { roomId: 123 },
    });
    expect(res.status).toBe(200);
    expect(deleteRoomMock).toBeCalledWith({
      where: {
        id: 123,
      },
    });
  });
});
