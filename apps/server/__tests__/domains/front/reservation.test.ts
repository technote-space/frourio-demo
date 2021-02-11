import { addDays, startOfTomorrow } from 'date-fns';
import { sendRoomKey } from '$/domains/front/reservation';
import { getReservations } from '$/repositories/reservation';
import { updateRoom } from '$/repositories/room';
import { getPromiseLikeItem } from '$/__tests__/utils';

describe('sendRoomKey', () => {
  it('should send mail', async() => {
    const getReservationsMock = jest.fn(() => getPromiseLikeItem([
      { guestEmail: 'test1@example.com', roomId: 1, code: '1', room: { key: '1111' } },
      { guestEmail: 'test2@example.com', roomId: null, code: '2', room: { key: '2222' } },
      { guestEmail: 'test3@example.com', roomId: 3, code: '3', room: { key: '3333' } },
    ]));
    const sendHtmlMailMock = jest.fn();
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
      sendHtmlMail: sendHtmlMailMock,
      encryptQrInfo: encryptQrInfoMock,
      toDataURL: toDataURLMock,
      sleep: sleepMock,
      updateRoom: updateRoom.inject({
        prisma: {
          room: {
            update: updateRoomMock,
          },
        },
      }),
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
    expect(sendHtmlMailMock).toBeCalledTimes(2);
    expect(sendHtmlMailMock.mock.calls).toEqual([
      ['test1@example.com', '入室情報のお知らせ', 'RoomKey', {
        'reservation.code': '1',
        'reservation.guestEmail': 'test1@example.com',
        'reservation.key': expect.any(String),
        'reservation.roomId': 1,
        'reservation.qr': 'url',
      }],
      ['test3@example.com', '入室情報のお知らせ', 'RoomKey', {
        'reservation.code': '3',
        'reservation.guestEmail': 'test3@example.com',
        'reservation.key': expect.any(String),
        'reservation.roomId': 3,
        'reservation.qr': 'url',
      }],
    ]);
    expect(encryptQrInfoMock).toBeCalledTimes(2);
    expect(encryptQrInfoMock.mock.calls).toEqual([
      [{ code: '1', key: expect.any(String), roomId: 1 }],
      [{ code: '3', key: expect.any(String), roomId: 3 }],
    ]);
    expect(toDataURLMock).toBeCalledTimes(2);
    expect(toDataURLMock.mock.calls).toEqual([
      ['test'],
      ['test'],
    ]);
    expect(updateRoomMock).toBeCalledTimes(2);
    expect(updateRoomMock.mock.calls).toEqual([
      [{ data: { key: expect.any(String) }, where: { id: 1 } }],
      [{ data: { key: expect.any(String) }, where: { id: 3 } }],
    ]);
    expect(sleepMock).toBeCalledTimes(2);
  });
});
