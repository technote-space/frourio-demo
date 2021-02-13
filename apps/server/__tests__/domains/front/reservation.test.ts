import { addDays, startOfTomorrow } from 'date-fns';
import { getPromiseLikeItem } from '$/__tests__/utils';
import { sendRoomKey } from '$/domains/front/reservation';
import { getReservations } from '$/repositories/reservation';
import { updateRoom } from '$/repositories/room';
import * as mail from '$/service/mail/utils';

jest.mock('$/service/mail/utils');

describe('sendRoomKey', () => {
  it('should send mail', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { guestEmail: 'test1@example.com', id: 1, roomId: 11, room: { key: '1111' } },
      { guestEmail: 'test2@example.com', id: 2, roomId: null, room: { key: '2222' } },
      { guestEmail: 'test3@example.com', id: 3, roomId: 33, room: { key: '3333' } },
    ]));
    const encryptQrInfoMock = jest.fn(() => 'test');
    const toDataURLMock = jest.fn(() => getPromiseLikeItem('url'));
    const sleepMock = jest.fn();
    const updateRoomMock = jest.fn();

    const injected = sendRoomKey.inject({
      getReservations: getReservations.inject({
        prisma: {
          reservation: {
            findMany: getReservationsMock,
          },
        },
      }),
      updateRoom: updateRoom.inject({
        prisma: {
          room: {
            update: updateRoomMock,
          },
        },
      }),
      sleep: sleepMock,
      encryptQrInfo: encryptQrInfoMock,
      toDataURL: toDataURLMock,
    });

    await injected();

    expect(getReservationsMock).toBeCalledWith({
      include: {
        room: {
          select: {
            key: true,
          },
        },
      },
      where: {
        checkin: {
          gte: startOfTomorrow(),
          lt: addDays(startOfTomorrow(), 1),
        },
        status: 'reserved',
      },
    });
    expect(spyOn).toBeCalledTimes(2);
    expect(spyOn.mock.calls).toEqual([
      ['test1@example.com', '入室情報のお知らせ', 'RoomKey', {
        'reservation.id': 1,
        'reservation.guestEmail': 'test1@example.com',
        'reservation.key': expect.any(String),
        'reservation.roomId': 11,
        'reservation.qr': 'url',
      }],
      ['test3@example.com', '入室情報のお知らせ', 'RoomKey', {
        'reservation.id': 3,
        'reservation.guestEmail': 'test3@example.com',
        'reservation.key': expect.any(String),
        'reservation.roomId': 33,
        'reservation.qr': 'url',
      }],
    ]);
    expect(encryptQrInfoMock).toBeCalledTimes(2);
    expect(encryptQrInfoMock.mock.calls).toEqual([
      [{ reservationId: 1, key: expect.any(String), roomId: 11 }],
      [{ reservationId: 3, key: expect.any(String), roomId: 33 }],
    ]);
    expect(toDataURLMock).toBeCalledTimes(2);
    expect(toDataURLMock.mock.calls).toEqual([
      ['test'],
      ['test'],
    ]);
    expect(updateRoomMock).toBeCalledTimes(2);
    expect(updateRoomMock.mock.calls).toEqual([
      [{ data: { key: expect.any(String), trials: 0 }, where: { id: 11 } }],
      [{ data: { key: expect.any(String), trials: 0 }, where: { id: 33 } }],
    ]);
    expect(sleepMock).toBeCalledTimes(2);
  });
});
