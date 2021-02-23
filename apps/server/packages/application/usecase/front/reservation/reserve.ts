import type { IRoomRepository } from '$/packages/domain/database/room';
import type { IGuestRepository } from '$/packages/domain/database/guest';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IPaymentRepository } from '$/packages/domain/payment';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IMailRepository } from '$/packages/domain/mail';
import type { GuestAuthorizationPayload } from '$/packages/application/service/auth';
import type { CreateReservationBody } from './validators';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { differenceInCalendarDays } from 'date-fns';
import { createPaymentIntents } from '$/packages/application/usecase/stripe/service';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';
import { startWithUppercase } from '@/utils/string';

const getReservationGuest = (body: CreateReservationBody, guest: { email?: string }) => ({
  guestEmail: (body.guestEmail ?? guest.email)!,
  guestName: body.guestName,
  guestNameKana: body.guestNameKana,
  guestZipCode: body.guestZipCode,
  guestAddress: body.guestAddress,
  guestPhone: body.guestPhone,
});

@singleton()
export class ReserveUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IRoomRepository') private roomRepository: IRoomRepository,
    @inject('IGuestRepository') private guestRepository: IGuestRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IMailRepository') private mail: IMailRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { createPaymentIntents },
    async({ createPaymentIntents }, body: CreateReservationBody, user?: GuestAuthorizationPayload) => {
      const room = await this.roomRepository.find(body.roomId);
      const checkin = new Date(body.checkin);
      const checkout = new Date(body.checkout);
      const nights = differenceInCalendarDays(checkout, checkin);
      const guest = user?.id ? await this.guestRepository.find(user.id, {
        select: Object.assign({
          paymentId: true,
        }, ...RESERVATION_GUEST_FIELDS.map(field => ({ [field]: true }))),
      }) : {};
      const amount = body.number * room.price * nights;

      const reservation = await this.reservationRepository.create({
        ...(user ? {
          guest: {
            connect: {
              id: user.id,
            },
          },
        } : {}),
        ...getReservationGuest(body, guest),
        room: {
          connect: {
            id: body.roomId,
          },
        },
        roomName: room.name,
        number: body.number,
        amount,
        checkin,
        checkout,
        status: 'reserved',
        paymentIntents: (await createPaymentIntents(this.payment, amount, guest, body.paymentMethodsId)).id,
      });
      if (user?.id) {
        await this.guestRepository.update(user.id, Object.assign({}, ...RESERVATION_GUEST_FIELDS.map(field => {
          return { [field]: body.updateInfo || !guest[field] ? body[`guest${startWithUppercase(field)}`] : guest[field] };
        })));
      }

      await this.mail.sendReservedMail(reservation);
      return this.response.success(reservation);
    },
  );
}
