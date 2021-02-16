import { getPromiseLikeItem } from '$/__tests__/utils';
import { sendRoomKey } from '$/domains/front/reservation';
import { getReservations } from '$/repositories/reservation';
import { getRooms } from '$/repositories/room';
import { createRoomKey } from '$/repositories/roomKey';
import { getValidReservation, isValidCheckinDateRange } from '$/service/reservation';
import * as mail from '$/service/mail/utils';

jest.mock('$/service/mail/utils');

describe('sendRoomKey', () => {
  it('should send mail', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getRoomsMock = jest.fn(() => getPromiseLikeItem([
      { id: 1 },
      { id: 2 },
    ]));
    const getReservationsMock = jest.fn((args) => getPromiseLikeItem(args.where.roomId === 1 ? [
      { guestEmail: 'test1@example.com', id: 11, roomId: 1, room: { key: '1111' } },
    ] : []));
    const createRoomKeyMock = jest.fn(() => getPromiseLikeItem({ key: 'new key' }));
    const encryptQrInfoMock = jest.fn(() => 'test');
    const toDataURLMock = jest.fn(() => getPromiseLikeItem('url'));
    const sleepMock = jest.fn();

    const injected = sendRoomKey.inject({
      getRooms: getRooms.inject({
        prisma: {
          room: {
            findMany: getRoomsMock,
          },
        },
      }),
      getValidReservation: getValidReservation.inject({
        getReservations: getReservations.inject({
          prisma: {
            reservation: {
              findMany: getReservationsMock,
            },
          },
        }),
        isValidCheckinDateRange: isValidCheckinDateRange.inject({
          isBefore: () => true,
          isAfter: () => true,
        }),
      }),
      createRoomKey: createRoomKey.inject({
        prisma: {
          roomKey: {
            create: createRoomKeyMock,
          },
        },
      }),
      sleep: sleepMock,
      encryptQrInfo: encryptQrInfoMock,
      toDataURL: toDataURLMock,
    });

    await injected();

    expect(getRoomsMock).toBeCalledWith(undefined);
    expect(createRoomKeyMock).toBeCalledWith({
      data: {
        key: expect.any(String),
        trials: 0,
        startAt: expect.any(Date),
        endAt: expect.any(Date),
        reservation: {
          connect: {
            id: 11,
          },
        },
      },
    });
    expect(spyOn).toBeCalledWith('test1@example.com', '入室情報のお知らせ', 'RoomKey', {
      'reservation.id': 11,
      'reservation.guestEmail': 'test1@example.com',
      'reservation.key': expect.any(String),
      'reservation.roomId': 1,
      'reservation.qr': 'url',
    });
    expect(encryptQrInfoMock).toBeCalledWith({ reservationId: 11, key: expect.any(String), roomId: 1 });
    expect(toDataURLMock).toBeCalledWith('test');
    expect(sleepMock).toBeCalledTimes(1);
  });
});
