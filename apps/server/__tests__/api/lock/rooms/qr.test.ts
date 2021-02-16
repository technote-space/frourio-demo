import controller from '$/api/lock/rooms/_roomId@number/qr/controller';
import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import { validateQr, checkinProcess } from '$/domains/lock/rooms';
import { getRoomKey } from '$/repositories/roomKey';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { isValidCheckinDateRange } from '$/service/reservation';
import { capturePaymentIntents } from '$/domains/stripe';

describe('rooms/qr', () => {
  it('should validate qr', async() => {
    const decryptQrInfoMock = jest.fn(() => ({ reservationId: 2, key: '1234', roomId: 1 }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 2,
      roomId: 1,
    }));
    const getRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      key: '1234',
    }));
    const updateReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 2,
      status: 'checkin',
    }));
    const injectedController = controller.inject({
      validateQr: validateQr.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        getRoomKey: getRoomKey.inject({
          prisma: {
            roomKey: {
              findFirst: getRoomKeyMock,
            },
          },
        }),
        checkinProcess: checkinProcess.inject({
          capturePaymentIntents: capturePaymentIntents.inject({
            updateReservation: updateReservation.inject({
              prisma: {
                reservation: {
                  update: updateReservationMock,
                },
              },
            }),
          }),
        }),
        decryptQrInfo: decryptQrInfoMock,
        isValidCheckinDateRange: isValidCheckinDateRange.inject({
          isAfter: () => true,
          isBefore: () => true,
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, data: 'encrypted' } });
    expect(res.body).toEqual({ result: true, reservation: { id: 2, status: 'checkin' } });
    expect(decryptQrInfoMock).toBeCalledWith('encrypted');
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 2,
      },
    });
    expect(getRoomKeyMock).toBeCalledWith({
      where: {
        reservationId: 2,
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
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
  });

  it('should failed to validate qr (invalid key)', async() => {
    const decryptQrInfoMock = jest.fn(() => ({ reservationId: 2, key: '2222', roomId: 1 }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 2,
      roomId: 1,
    }));
    const getRoomKeyMock = jest.fn(() => getPromiseLikeItem({
      key: '1234',
    }));
    const injectedController = controller.inject({
      validateQr: validateQr.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        getRoomKey: getRoomKey.inject({
          prisma: {
            roomKey: {
              findFirst: getRoomKeyMock,
            },
          },
        }),
        decryptQrInfo: decryptQrInfoMock,
        isValidCheckinDateRange: isValidCheckinDateRange.inject({
          isAfter: () => true,
          isBefore: () => true,
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, data: 'encrypted' } });
    expect(res.body).toEqual({ result: false, message: '無効なQRコードです。' });
    expect(decryptQrInfoMock).toBeCalledWith('encrypted');
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 2,
      },
    });
    expect(getRoomKeyMock).toBeCalledWith({
      where: {
        reservationId: 2,
        startAt: {
          lte: expect.any(Date),
        },
        endAt: {
          gte: expect.any(Date),
        },
      },
    });
  });

  it('should failed to validate qr (invalid date range)', async() => {
    const decryptQrInfoMock = jest.fn(() => ({ reservationId: 2, key: '1234', roomId: 1 }));
    const getReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 2,
      roomId: 1,
    }));
    const injectedController = controller.inject({
      validateQr: validateQr.inject({
        getReservation: getReservation.inject({
          prisma: {
            reservation: {
              findFirst: getReservationMock,
            },
          },
        }),
        decryptQrInfo: decryptQrInfoMock,
        isValidCheckinDateRange: isValidCheckinDateRange.inject({
          isAfter: () => true,
          isBefore: () => false,
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, data: 'encrypted' } });
    expect(res.body).toEqual({ result: false, message: '無効なQRコードです。' });
    expect(decryptQrInfoMock).toBeCalledWith('encrypted');
    expect(getReservationMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 2,
      },
    });
  });

  it('should failed to validate qr (invalid qr)', async() => {
    const decryptQrInfoMock = jest.fn(() => undefined);
    const injectedController = controller.inject({
      validateQr: validateQr.inject({
        decryptQrInfo: decryptQrInfoMock,
      }),
    })(getFastify());

    const res = await injectedController.post({ params: { roomId: 1 }, body: { roomId: 1, data: 'encrypted' } });
    expect(res.status).toBe(400);
    expect(decryptQrInfoMock).toBeCalledWith('encrypted');
  });
});
