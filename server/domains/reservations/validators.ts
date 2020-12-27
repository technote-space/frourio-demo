import { IsPositive, IsDateString, IsEnum, Min, IsInt, IsOptional } from 'class-validator';
import { IsIdExists, IsWithinLimit, IsReservable } from '$/utils/prisma/validator';
import { ReservationStatus } from '$/types';

export class ReservationBody {
  @IsIdExists('guest')
  guestId: number;

  @IsIdExists('room')
  roomId: number;

  @IsPositive()
  @IsWithinLimit('room', 'number')
  number: number;

  @IsDateString()
  checkin: string;

  @IsDateString()
  @IsReservable()
  checkout: string;

  @IsOptional()
  @IsEnum(Object.keys(ReservationStatus))
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  payment?: number;
}
