import { TestPaymentRepository } from '$/__tests__/__mocks__/infra/payment';
import { TestReservationRepository, getDummyReservationData } from '$/__tests__/__mocks__/infra/database/reservation';
import { getRoom } from '$/__tests__/__mocks__/infra/database/room';
import { getGuest } from '$/__tests__/__mocks__/infra/database/guest';
import {
  createPaymentIntents,
  cancelPaymentIntents,
  capturePaymentIntents,
} from '$/packages/application/usecase/stripe/service';

describe('createPaymentIntents', () => {
  it('should create payment intents', async() => {
    expect(await createPaymentIntents(new TestPaymentRepository(), 10000, {
      id: 123,
      paymentId: 'cus_test',
    }, 'pm_test')).toEqual({
      id: 'pi_test',
      amount: 10000,
      amountReceived: 10000,
    });
  });
});

describe('cancelPaymentIntents', () => {
  it('should cancel payment intents', async() => {
    expect(await cancelPaymentIntents(new TestReservationRepository([
      getDummyReservationData(await getRoom(), await getGuest()),
    ]), new TestPaymentRepository(), {
      id: 1,
      paymentIntents: 'pi_test',
    })).toEqual({
      id: 1,
      code: expect.any(String),
      guestId: 1,
      guestEmail: expect.any(String),
      guestName: expect.any(String),
      guestNameKana: expect.any(String),
      guestZipCode: expect.any(String),
      guestAddress: expect.any(String),
      guestPhone: expect.any(String),
      roomId: 1,
      roomName: expect.any(String),
      number: expect.any(Number),
      amount: expect.any(Number),
      status: 'cancelled',
      payment: 10000,
      checkin: expect.any(Date),
      checkout: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe('capturePaymentIntents', () => {
  it('should capture payment intents', async() => {
    expect(await capturePaymentIntents(new TestReservationRepository([
      getDummyReservationData(await getRoom(), await getGuest()),
    ]), new TestPaymentRepository(), {
      id: 1,
      code: 'test code',
      guestId: 1,
      guestEmail: 'test@example.com',
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'test',
      guestPhone: '090-0000-0000',
      roomId: 1,
      roomName: 'room name',
      number: 2,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
      status: 'reserved',
      payment: null,
      paymentIntents: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })).toEqual({
      id: 1,
      code: expect.any(String),
      guestId: 1,
      guestEmail: expect.any(String),
      guestName: expect.any(String),
      guestNameKana: expect.any(String),
      guestZipCode: expect.any(String),
      guestAddress: expect.any(String),
      guestPhone: expect.any(String),
      roomId: 1,
      roomName: expect.any(String),
      number: expect.any(Number),
      amount: expect.any(Number),
      status: 'checkin',
      payment: 10000,
      checkin: expect.any(Date),
      checkout: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should capture payment intents (cancel)', async() => {
    expect(await capturePaymentIntents(new TestReservationRepository([
      getDummyReservationData(await getRoom(), await getGuest()),
    ]), new TestPaymentRepository({
      captured: {
        id: 'pi_test',
        amount: 10000,
        amountReceived: 8000,
      },
    }), {
      id: 1,
      code: 'test code',
      guestId: 1,
      guestEmail: 'test@example.com',
      guestName: 'test name',
      guestNameKana: 'テスト',
      guestZipCode: '100-0001',
      guestAddress: 'test',
      guestPhone: '090-0000-0000',
      roomId: 1,
      roomName: 'room name',
      number: 2,
      amount: 10000,
      checkin: new Date(),
      checkout: new Date(),
      status: 'reserved',
      payment: null,
      paymentIntents: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, true)).toEqual({
      id: 1,
      code: expect.any(String),
      guestId: 1,
      guestEmail: expect.any(String),
      guestName: expect.any(String),
      guestNameKana: expect.any(String),
      guestZipCode: expect.any(String),
      guestAddress: expect.any(String),
      guestPhone: expect.any(String),
      roomId: 1,
      roomName: expect.any(String),
      number: expect.any(Number),
      amount: expect.any(Number),
      status: 'cancelled',
      payment: 8000,
      checkin: expect.any(Date),
      checkout: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
