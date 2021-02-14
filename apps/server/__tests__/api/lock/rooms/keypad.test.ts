import controller from '$/api/lock/rooms/_roomId@number/keypad/controller';
import { startOfDay, endOfDay } from 'date-fns';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { validateKey } from '$/domains/lock/rooms';
import { getRoomKey, createRoomKey, updateRoomKey } from '$/repositories/roomKey';
import { getReservations, updateReservation } from '$/repositories/reservation';
import { getValidReservation, isValidCheckinDateRange } from '$/service/reservation';
import { MAX_TRIALS } from '@frourio-demo/constants';
import * as mail from '$/service/mail/utils';

jest.mock('$/service/mail/utils');

describe('rooms/keypad', () => {
  it('should validate key', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      {
        id: 2,
        roomId: 1,
      },
    ]));
    const getRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      id: 3,
      key: '1234',
    }));
    const updateReservationMock = jest.fn();
    const updateRoomKeyMock = jest.fn();
    const injectedController = controller.inject({
      validateKey: validateKey.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => true,
            isBefore: () => true,
          }),
        }),
        getRoomKey: getRoomKey.inject({
          prisma: {
            roomKey: {
              findFirst: getRoomKeyMock,
            },
          },
        }),
        updateReservation: updateReservation.inject({
          prisma: {
            reservation: {
              update: updateReservationMock,
            },
          },
        }),
        updateRoomKey: updateRoomKey.inject({
          prisma: {
            roomKey: {
              update: updateRoomKeyMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, key: '1234' } });
    expect(res.body).toEqual({ result: true, reservation: { id: 2, roomId: 1 } });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        status: {
          in: [
            'reserved',
            'checkin',
          ],
        },
      },
    });
    expect(getRoomKeyMock).toBeCalledWith({
      where: {
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
        reservationId: 2,
      },
    });
    expect(updateReservationMock).toBeCalledWith({
      data: {
        status: 'checkin',
      },
      where: {
        id: 2,
      },
    });
    expect(updateRoomKeyMock).toBeCalledWith({
      data: {
        trials: 0,
      },
      where: {
        id: 3,
      },
    });
  });

  it('should update room key', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{
      id: 2,
      roomId: 1,
      guestEmail: 'test@example.com',
    }]));
    const getRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      id: 3,
      key: '1234',
      trials: MAX_TRIALS,
    }));
    const createRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      key: 'new key',
    }));
    const encryptQrInfoMock = jest.fn(() => 'qr');
    const toDataURLMock = jest.fn(() => getPromiseLikeItem('url'));
    const injectedController = controller.inject({
      validateKey: validateKey.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => true,
            isBefore: () => true,
          }),
        }),
        getRoomKey: getRoomKey.inject({
          prisma: {
            roomKey: {
              findFirst: getRoomKeyMock,
            },
          },
        }),
        createRoomKey: createRoomKey.inject({
          prisma: {
            roomKey: {
              create: createRoomKeyMock,
            },
          },
        }),
        encryptQrInfo: encryptQrInfoMock,
        toDataURL: toDataURLMock,
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, key: '2222' } });
    expect(res.body).toEqual({ result: false, message: '入室情報が再送されました。メールに記載された番号を入力してください。' });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        status: {
          in: [
            'reserved',
            'checkin',
          ],
        },
      },
    });
    expect(getRoomKeyMock).toBeCalledWith({
      where: {
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
        reservationId: 2,
      },
    });
    expect(createRoomKeyMock).toBeCalledWith({
      data: {
        key: expect.any(String),
        trials: 0,
        startAt: expect.any(Date),
        endAt: expect.any(Date),
        reservation: {
          connect: {
            id: 2,
          },
        },
      },
    });
    expect(encryptQrInfoMock).toBeCalledWith({
      key: 'new key',
      reservationId: 2,
      roomId: 1,
    });
    expect(toDataURLMock).toBeCalledWith('qr');
    expect(spyOn).toBeCalledWith('test@example.com', '入室情報のお知らせ', 'RoomKey', {
      'reservation.guestEmail': 'test@example.com',
      'reservation.id': 2,
      'reservation.key': 'new key',
      'reservation.qr': 'url',
      'reservation.roomId': 1,
    });
  });

  it('should update room key (not found room key)', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{
      id: 2,
      roomId: 1,
      guestEmail: 'test@example.com',
    }]));
    const getRoomKeyMock = jest.fn(() => getPromiseLikeItem(null));
    const createRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      key: 'new key',
    }));
    const encryptQrInfoMock = jest.fn(() => 'qr');
    const toDataURLMock = jest.fn(() => getPromiseLikeItem('url'));
    const injectedController = controller.inject({
      validateKey: validateKey.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => true,
            isBefore: () => true,
          }),
        }),
        getRoomKey: getRoomKey.inject({
          prisma: {
            roomKey: {
              findFirst: getRoomKeyMock,
            },
          },
        }),
        createRoomKey: createRoomKey.inject({
          prisma: {
            roomKey: {
              create: createRoomKeyMock,
            },
          },
        }),
        encryptQrInfo: encryptQrInfoMock,
        toDataURL: toDataURLMock,
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, key: 'encrypted' } });
    expect(res.body).toEqual({ result: false, message: '入室情報が再送されました。メールに記載された番号を入力してください。' });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        status: {
          in: [
            'reserved',
            'checkin',
          ],
        },
      },
    });
    expect(getRoomKeyMock).toBeCalledWith({
      where: {
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
        reservationId: 2,
      },
    });
    expect(encryptQrInfoMock).toBeCalledWith({
      key: 'new key',
      reservationId: 2,
      roomId: 1,
    });
    expect(toDataURLMock).toBeCalledWith('qr');
    expect(spyOn).toBeCalledWith('test@example.com', '入室情報のお知らせ', 'RoomKey', {
      'reservation.guestEmail': 'test@example.com',
      'reservation.id': 2,
      'reservation.key': 'new key',
      'reservation.qr': 'url',
      'reservation.roomId': 1,
    });
  });

  it('should not update room key', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{
      id: 2,
      roomId: 1,
    }]));
    const getRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      id: 3,
      key: '1234',
      trials: 0,
    }));
    const updateRoomKeyMock = jest.fn();
    const injectedController = controller.inject({
      validateKey: validateKey.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => true,
            isBefore: () => true,
          }),
        }),
        getRoomKey: getRoomKey.inject({
          prisma: {
            roomKey: {
              findFirst: getRoomKeyMock,
            },
          },
        }),
        updateRoomKey: updateRoomKey.inject({
          prisma: {
            roomKey: {
              update: updateRoomKeyMock,
            },
          },
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, key: '2222' } });
    expect(res.body).toEqual({ result: false, message: '正しい番号を入力してください。' });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        status: {
          in: [
            'reserved',
            'checkin',
          ],
        },
      },
    });
    expect(getRoomKeyMock).toBeCalledWith({
      where: {
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
        reservationId: 2,
      },
    });
    expect(updateRoomKeyMock).toBeCalledWith({
      data: {
        trials: {
          increment: 1,
        },
      },
      where: {
        id: 3,
      },
    });
  });

  it('should failed to validate key (not found reservation)', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([{
      id: 2,
      roomId: 1,
    }]));
    const injectedController = controller.inject({
      validateKey: validateKey.inject({
        getValidReservation: getValidReservation.inject({
          getReservations: getReservations.inject({
            prisma: {
              reservation: {
                findMany: getReservationsMock,
              },
            },
          }),
          isValidCheckinDateRange: isValidCheckinDateRange.inject({
            isAfter: () => true,
            isBefore: () => false,
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, key: 'encrypted' } });
    expect(res.body).toEqual({ result: false, message: '有効な予約が見つかりません。' });
    expect(getReservationsMock).toBeCalledWith({
      where: {
        roomId: 1,
        checkin: {
          lt: endOfDay(new Date()),
        },
        checkout: {
          gt: startOfDay(new Date()),
        },
        status: {
          in: [
            'reserved',
            'checkin',
          ],
        },
      },
    });
  });
});
