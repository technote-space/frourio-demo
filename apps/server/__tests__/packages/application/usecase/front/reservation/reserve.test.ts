import { ReserveUseCase } from '$/packages/application/usecase/front/reservation/reserve';
import { TestReservationRepository } from '$/__tests__/__mocks__/infra/database/reservation';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { TestMailRepository } from '$/__tests__/__mocks__/infra/mail';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { ResponseRepository } from '$/packages/infra/http/response';
import { getPromiseLikeItem } from '$/__tests__/utils';

describe('ReserveUseCase', () => {
  it('should reserve', async() => {
    expect(await (new ReserveUseCase(
      new TestReservationRepository(),
      new TestRoomRepository([getDummyRoomData()]),
      new TestGuestRepository([getDummyGuestData()]),
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute.inject({
      createPaymentIntents: () => getPromiseLikeItem({ id: 'pi_test' }),
    })({
      guestEmail: 'test@example.com',
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'test',
      guestPhone: '090-0000-0000',
      roomId: 1,
      number: 2,
      checkin: '2020-01-01',
      checkout: '2020-01-03',
      paymentMethodsId: 'pm_test',
    })).toEqual({
      status: 200,
      body: {
        'id': 1,
        'amount': expect.any(Number),
        'guestAddress': expect.any(String),
        'guestEmail': expect.any(String),
        'guestName': expect.any(String),
        'guestNameKana': expect.any(String),
        'guestPhone': expect.any(String),
        'guestZipCode': expect.any(String),
        'number': expect.any(Number),
        'roomId': 1,
        'roomName': expect.any(String),
        'status': 'reserved',
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'paymentIntents': 'pi_test',
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      },
    });
  });

  it('should reserve', async() => {
    expect(await (new ReserveUseCase(
      new TestReservationRepository(),
      new TestRoomRepository([getDummyRoomData()]),
      new TestGuestRepository([getDummyGuestData({ address: null })]),
      new TestPaymentRepository(),
      new TestMailRepository(),
      new ResponseRepository(),
    )).execute.inject({
      createPaymentIntents: () => getPromiseLikeItem({ id: 'pi_test' }),
    })({
      guestId: 1,
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'test',
      guestPhone: '090-0000-0000',
      roomId: 1,
      number: 2,
      checkin: '2020-01-01',
      checkout: '2020-01-03',
      paymentMethodsId: 'pm_test',
    }, { id: 1 })).toEqual({
      status: 200,
      body: {
        'id': 1,
        'amount': expect.any(Number),
        'guestId': 1,
        'guestAddress': expect.any(String),
        'guestEmail': expect.any(String),
        'guestName': expect.any(String),
        'guestNameKana': expect.any(String),
        'guestPhone': expect.any(String),
        'guestZipCode': expect.any(String),
        'number': expect.any(Number),
        'roomId': 1,
        'roomName': expect.any(String),
        'status': 'reserved',
        'checkin': expect.any(Date),
        'checkout': expect.any(Date),
        'paymentIntents': 'pi_test',
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date),
      },
    });
  });
});
