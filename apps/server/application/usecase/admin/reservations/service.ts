import type { ReservationBody } from '$/application/usecase/admin/reservations/validators';
import type { CreateReservationData, UpdateReservationData } from '$/domain/database/reservation';
import type { IGuestRepository } from '$/domain/database/guest';
import type { IRoomRepository } from '$/domain/database/room';
import type { IPaymentRepository } from '$/domain/payment';
import { differenceInCalendarDays } from 'date-fns';
import { startWithUppercase } from '@frourio-demo/utils/string';
import { createPaymentIntents } from '$/application/usecase/stripe/service';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';

const getUpdateReservationData = async(data: ReservationBody, roomRepository: IRoomRepository): Promise<UpdateReservationData> => {
  const room = await roomRepository.find(data.roomId);
  const checkin = new Date(data.checkin);
  const checkout = new Date(data.checkout);
  const nights = differenceInCalendarDays(checkout, checkin);

  return {
    room: {
      connect: {
        id: data.roomId,
      },
    },
    roomName: room.name,
    number: data.number,
    amount: data.number * room.price * nights,
    checkin,
    checkout,
    status: data.status ?? 'reserved',
    payment: data.payment,
  };
};
const fillReservationDataWithGuest = async(data: ReservationBody, guestId: number, guestRepository: IGuestRepository, roomRepository: IRoomRepository): Promise<CreateReservationData> => {
  const guest = await guestRepository.find(guestId);
  if (RESERVATION_GUEST_FIELDS.some(field => !guest[field])) {
    throw new Error('必須項目が登録されていないゲストは指定できません。');
  }

  return Object.assign({
    guest: {
      connect: {
        id: data.guestId,
      },
    },
    ...await getUpdateReservationData(data, roomRepository),
  }, ...RESERVATION_GUEST_FIELDS.map(field => ({ [`guest${startWithUppercase(field)}`]: guest[field] })));
};
export const fillCreateReservationData = async(data: ReservationBody, guestRepository: IGuestRepository, roomRepository: IRoomRepository): Promise<CreateReservationData> | never => {
  if (!data.guestId) {
    throw new Error('ゲストが選択されていません。');
  }

  return fillReservationDataWithGuest(data, data.guestId, guestRepository, roomRepository);
};
export const fillUpdateReservationData = async(data: ReservationBody, guestRepository: IGuestRepository, roomRepository: IRoomRepository): Promise<UpdateReservationData> | never => {
  if (data.guestId) {
    return fillReservationDataWithGuest(data, data.guestId, guestRepository, roomRepository);
  }

  return getUpdateReservationData(data, roomRepository);
};
export const processCreateStripe = async(data: ReservationBody, createData: CreateReservationData, guestRepository: IGuestRepository, paymentRepository: IPaymentRepository): Promise<CreateReservationData> | never => {
  const guest = await guestRepository.find(data.guestId!);
  const paymentMethod = await paymentRepository.getDefaultPaymentMethod(guest);
  if (!paymentMethod) {
    throw new Error('支払い方法が設定されていないゲストは指定できません。');
  }

  const paymentIntents = await createPaymentIntents(paymentRepository, createData.amount, guest, paymentMethod);
  return {
    ...createData,
    paymentIntents: paymentIntents.id,
  };
};
