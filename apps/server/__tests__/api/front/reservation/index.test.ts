import { getFastify, getPromiseLikeItem } from '$/__tests__/utils';
import controller from '$/api/front/reservation/controller';
import { getRoom } from '$/repositories/room';
import { createReservation } from '$/repositories/reservation';
import { getGuest, updateGuest } from '$/repositories/guest';
import { reserve } from '$/domains/front/reservation';
import { createPaymentIntents } from '$/domains/stripe';
import { createStripePaymentIntents } from '$/repositories/stripe';
import * as mail from '$/service/mail/utils';

jest.mock('$/service/mail/utils');

describe('reservation', () => {
  it('should create reservation', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      name: 'room name',
      price: 10000,
    }));
    const createReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01T06:00:00.000Z'),
      checkout: new Date('2020-01-03T01:00:00.000Z'),
      number: 3,
      amount: 30000,
      guestName: 'test',
    }));
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'pi_test' }));
    const injectedController = controller.inject({
      reserve: reserve.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
        createReservation: createReservation.inject({
          prisma: {
            reservation: {
              create: createReservationMock,
            },
          },
        }),
        createPaymentIntents: createPaymentIntents.inject({
          createStripePaymentIntents: createStripePaymentIntents.inject({
            stripe: {
              paymentIntents: {
                create: paymentIntentsCreateMock,
              },
            },
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: {
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        roomId: 1,
        number: 2,
        checkin: '2020-01-01',
        checkout: '2020-01-03',
        paymentMethodsId: 'pm_test',
      },
      headers: undefined,
    });
    expect(res.body).toEqual({
      id: 123,
      checkin: new Date('2020-01-01T06:00:00.000Z'),
      checkout: new Date('2020-01-03T01:00:00.000Z'),
      number: 3,
      amount: 30000,
      guestName: 'test',
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(createReservationMock).toBeCalledWith({
      data: {
        code: expect.any(String),
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        number: 2,
        checkin: new Date('2020-01-01'),
        checkout: new Date('2020-01-03'),
        room: {
          connect: {
            id: 1,
          },
        },
        roomName: 'room name',
        amount: 40000,
        status: 'reserved',
        paymentIntents: 'pi_test',
      },
    });
    expect(spyOn).toBeCalledWith(undefined, '予約完了', 'Reserved', {
      'reservation.id': 123,
      'reservation.checkin': '2020/01/01 15:00',
      'reservation.checkout': '2020/01/03 10:00',
      'reservation.number': '3人',
      'reservation.amount': '¥30,000',
      'reservation.guestName': 'test',
    });
  });

  it('should create reservation with update info', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      name: 'room name',
      price: 10000,
    }));
    const createReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01T06:00:00.000Z'),
      checkout: new Date('2020-01-03T01:00:00.000Z'),
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 234,
      email: 'test@example.com',
    }));
    const updateGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 234,
    }));
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'pi_test' }));
    const injectedController = controller.inject({
      reserve: reserve.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
        createReservation: createReservation.inject({
          prisma: {
            reservation: {
              create: createReservationMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
        createPaymentIntents: createPaymentIntents.inject({
          createStripePaymentIntents: createStripePaymentIntents.inject({
            stripe: {
              paymentIntents: {
                create: paymentIntentsCreateMock,
              },
            },
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: {
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        roomId: 1,
        number: 2,
        checkin: '2020-01-01',
        checkout: '2020-01-03',
        paymentMethodsId: 'pm_test',
        updateInfo: 1,
      },
      user: { id: 321 },
      headers: undefined,
    });
    expect(res.body).toEqual({
      id: 123,
      checkin: new Date('2020-01-01T06:00:00.000Z'),
      checkout: new Date('2020-01-03T01:00:00.000Z'),
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      select: {
        email: true,
        name: true,
        nameKana: true,
        zipCode: true,
        address: true,
        phone: true,
        stripe: true,
      },
      where: {
        id: 321,
      },
    });
    expect(createReservationMock).toBeCalledWith({
      data: {
        code: expect.any(String),
        guest: {
          connect: {
            id: 321,
          },
        },
        guestEmail: 'test@example.com',
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        number: 2,
        checkin: new Date('2020-01-01'),
        checkout: new Date('2020-01-03'),
        room: {
          connect: {
            id: 1,
          },
        },
        roomName: 'room name',
        amount: 40000,
        status: 'reserved',
        paymentIntents: 'pi_test',
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        name: 'guest name',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市',
        phone: '03-0000-0000',
      },
      where: {
        id: 321,
      },
    });
    expect(spyOn).toBeCalledWith(undefined, '予約完了', 'Reserved', {
      'reservation.id': 123,
      'reservation.checkin': '2020/01/01 15:00',
      'reservation.checkout': '2020/01/03 10:00',
    });
  });

  it('should create reservation with update info', async() => {
    const spyOn = jest.spyOn(mail, 'sendHtmlMail');
    const getRoomMock = jest.fn(() => getPromiseLikeItem({
      name: 'room name',
      price: 10000,
    }));
    const createReservationMock = jest.fn(() => getPromiseLikeItem({
      id: 123,
      checkin: new Date('2020-01-01T06:00:00.000Z'),
      checkout: new Date('2020-01-03T01:00:00.000Z'),
    }));
    const getGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 234,
      email: 'test@example.com',
      name: 'guest name',
      nameKana: 'テスト',
      zipCode: '100-0001',
    }));
    const updateGuestMock = jest.fn(() => getPromiseLikeItem({
      id: 234,
    }));
    const paymentIntentsCreateMock = jest.fn(() => getPromiseLikeItem({ id: 'pi_test' }));
    const injectedController = controller.inject({
      reserve: reserve.inject({
        getRoom: getRoom.inject({
          prisma: {
            room: {
              findFirst: getRoomMock,
            },
          },
        }),
        createReservation: createReservation.inject({
          prisma: {
            reservation: {
              create: createReservationMock,
            },
          },
        }),
        getGuest: getGuest.inject({
          prisma: {
            guest: {
              findFirst: getGuestMock,
            },
          },
        }),
        updateGuest: updateGuest.inject({
          prisma: {
            guest: {
              update: updateGuestMock,
            },
          },
        }),
        createPaymentIntents: createPaymentIntents.inject({
          createStripePaymentIntents: createStripePaymentIntents.inject({
            stripe: {
              paymentIntents: {
                create: paymentIntentsCreateMock,
              },
            },
          }),
        }),
      }),
    })(getFastify());

    const res = await injectedController.post({
      body: {
        guestName: 'guest name 2',
        guestNameKana: 'テスト 2',
        guestZipCode: '100-0002',
        guestAddress: 'テスト県テスト市2',
        guestPhone: '03-0000-0002',
        roomId: 1,
        number: 2,
        checkin: '2020-01-01',
        checkout: '2020-01-03',
        paymentMethodsId: 'pm_test',
      },
      user: { id: 321 },
      headers: undefined,
    });
    expect(res.body).toEqual({
      id: 123,
      checkin: new Date('2020-01-01T06:00:00.000Z'),
      checkout: new Date('2020-01-03T01:00:00.000Z'),
    });
    expect(getRoomMock).toBeCalledWith({
      rejectOnNotFound: true,
      where: {
        id: 1,
      },
    });
    expect(getGuestMock).toBeCalledWith({
      rejectOnNotFound: true,
      select: {
        email: true,
        name: true,
        nameKana: true,
        zipCode: true,
        address: true,
        phone: true,
        stripe: true,
      },
      where: {
        id: 321,
      },
    });
    expect(createReservationMock).toBeCalledWith({
      data: {
        code: expect.any(String),
        guest: {
          connect: {
            id: 321,
          },
        },
        guestEmail: 'test@example.com',
        guestName: 'guest name 2',
        guestNameKana: 'テスト 2',
        guestZipCode: '100-0002',
        guestAddress: 'テスト県テスト市2',
        guestPhone: '03-0000-0002',
        number: 2,
        checkin: new Date('2020-01-01'),
        checkout: new Date('2020-01-03'),
        room: {
          connect: {
            id: 1,
          },
        },
        roomName: 'room name',
        amount: 40000,
        status: 'reserved',
        paymentIntents: 'pi_test',
      },
    });
    expect(updateGuestMock).toBeCalledWith({
      data: {
        email: 'test@example.com',
        name: 'guest name',
        nameKana: 'テスト',
        zipCode: '100-0001',
        address: 'テスト県テスト市2',
        phone: '03-0000-0002',
      },
      where: {
        id: 321,
      },
    });
    expect(spyOn).toBeCalledWith(undefined, '予約完了', 'Reserved', {
      'reservation.id': 123,
      'reservation.checkin': '2020/01/01 15:00',
      'reservation.checkout': '2020/01/03 10:00',
    });
  });
});
