import {
  fillCreateReservationData,
  fillUpdateReservationData,
  processCreateStripe,
} from '$/application/usecase/admin/reservations/service';
import { TestGuestRepository, getDummyGuestData } from '$/__tests__/__mocks__/infra/database/guest';
import { TestRoomRepository, getDummyRoomData } from '$/__tests__/__mocks__/infra/database/room';
import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';

describe('fillCreateReservationData', () => {
  it('should return create data', async() => {
    expect(await fillCreateReservationData({
        guestId: 1,
        roomId: 1,
        checkin: '2020-01-01',
        checkout: '2020-01-10',
        number: 1,
      },
      new TestGuestRepository([getDummyGuestData()]),
      new TestRoomRepository([getDummyRoomData()]),
    )).toEqual({
      guest: {
        connect: {
          id: 1,
        },
      },
      room: {
        connect: {
          id: 1,
        },
      },
      roomName: expect.any(String),
      number: expect.any(Number),
      amount: expect.any(Number),
      checkin: expect.any(Date),
      checkout: expect.any(Date),
      status: expect.any(String),
      guestEmail: expect.any(String),
      guestName: expect.any(String),
      guestNameKana: expect.any(String),
      guestZipCode: expect.any(String),
      guestAddress: expect.any(String),
      guestPhone: expect.any(String),
    });
  });

  it('should throw error', async() => {
    await expect(
      fillCreateReservationData(
        {
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        new TestGuestRepository([getDummyGuestData()]),
        new TestRoomRepository(),
      ),
    ).rejects.toThrow('ゲストが選択されていません。');
  });

  it('should throw error', async() => {
    await expect(
      fillCreateReservationData(
        {
          guestId: 1,
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        new TestGuestRepository([getDummyGuestData({ name: null })]),
        new TestRoomRepository(),
      ),
    ).rejects.toThrow('必須項目が登録されていないゲストは指定できません。');
  });
});

describe('fillUpdateReservationData', () => {
  it('should return update data', async() => {
    expect(await fillUpdateReservationData({
        roomId: 1,
        checkin: '2020-01-01',
        checkout: '2020-01-10',
        number: 1,
      },
      new TestGuestRepository([getDummyGuestData()]),
      new TestRoomRepository([getDummyRoomData()]),
    )).toEqual({
      room: {
        connect: {
          id: 1,
        },
      },
      roomName: expect.any(String),
      number: expect.any(Number),
      amount: expect.any(Number),
      checkin: expect.any(Date),
      checkout: expect.any(Date),
      status: expect.any(String),
    });
  });

  it('should throw error', async() => {
    await expect(
      fillUpdateReservationData(
        {
          guestId: 1,
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        new TestGuestRepository([getDummyGuestData({ name: null })]),
        new TestRoomRepository(),
      ),
    ).rejects.toThrow('必須項目が登録されていないゲストは指定できません。');
  });
});

describe('processCreateStripe', () => {
  it('should create payment intents', async() => {
    expect(await processCreateStripe(
      {
        guestId: 1,
        roomId: 1,
        checkin: '2020-01-01',
        checkout: '2020-01-10',
        number: 1,
      },
      {
        guestEmail: 'test@example.com',
        guestName: 'test',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'test',
        guestPhone: '090-0000-0000',
        roomName: 'test room',
        number: 2,
        amount: 10000,
        checkin: new Date(),
        checkout: new Date(),
      },
      new TestGuestRepository([getDummyGuestData()]),
      new TestPaymentRepository(),
    )).toEqual({
      guestEmail: 'test@example.com',
      guestName: 'test',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'test',
      guestPhone: '090-0000-0000',
      roomName: 'test room',
      number: 2,
      amount: 10000,
      checkin: expect.any(Date),
      checkout: expect.any(Date),
      paymentIntents: 'pi_test',
    });
  });

  it('should throw error', async() => {
    await expect(
      processCreateStripe(
        {
          guestId: 1,
          roomId: 1,
          checkin: '2020-01-01',
          checkout: '2020-01-10',
          number: 1,
        },
        {
          guestEmail: 'test@example.com',
          guestName: 'test',
          guestNameKana: 'テスト',
          guestZipCode: '100-0001',
          guestAddress: 'test',
          guestPhone: '090-0000-0000',
          roomName: 'test room',
          number: 2,
          amount: 10000,
          checkin: new Date(),
          checkout: new Date(),
        },
        new TestGuestRepository([getDummyGuestData()]),
        new TestPaymentRepository({ defaultPaymentMethod: null }),
      ),
    ).rejects.toThrow('支払い方法が設定されていないゲストは指定できません。');
  });
});
