import { IsNotEmpty, IsPositive, IsDateString, IsEnum, Min, IsInt, IsOptional } from 'class-validator';
import { IsIdExists, IsWithinLimit, IsReservable } from '$/utils/prisma/validator';
import { ReservationStatus } from '$/types';

export class ReservationBody {
  @IsInt()
  @IsPositive()
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @IsIdExists('guest')
  guestId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @IsIdExists('room')
  roomId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @IsWithinLimit('room', 'number')
  number: number;

  @IsNotEmpty()
  @IsDateString()
  checkin: string;

  @IsNotEmpty()
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
