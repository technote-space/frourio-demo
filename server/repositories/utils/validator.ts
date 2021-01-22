/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '$/prisma/client';
import { startOfDay, isAfter } from 'date-fns';
import { Models } from '.';

@ValidatorConstraint({ async: true })
class IsIdExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'number') {
      return false;
    }

    const table = args.constraints[0] as Models;
    const prisma = new PrismaClient();
    const findFirst = prisma[table].findFirst as ((args?: { where: { id: number } }) => Promise<object | null>);
    const item = await findFirst({ where: { id: Number(value) } });
    return item !== null;
  }

  defaultMessage() {
    return 'Data not exists';
  }
}

export function IsIdExists(table: Models, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table],
      validator: IsIdExistsConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
class IsReservableConstraint implements ValidatorConstraintInterface {
  private reason?: string;

  async validate(value: any, args: ValidationArguments) {
    const data = args.object as any;
    if (!('roomId' in data) || typeof data['roomId'] !== 'number') {
      this.reason = '部屋が選択されていません';
      return false;
    }
    if (!('guestId' in data) || typeof data['guestId'] !== 'number') {
      this.reason = '宿泊客が選択されていません';
      return false;
    }

    if (!('checkin' in data) || !('checkout' in data) || !data['checkin'] || !data['checkout']) {
      this.reason = '宿泊期間が指定されていません';
      return false;
    }

    const checkin = new Date(data['checkin']);
    const checkout = new Date(data['checkout']);
    if (!isAfter(startOfDay(checkout), startOfDay(checkin))) {
      this.reason = 'チェックアウトはチェックインよりも後である必要があります';
      return false;
    }

    const prisma = new PrismaClient();
    const where = {
      AND: [
        {
          checkin: {
            lt: checkout,
          },
          checkout: {
            gt: checkin,
          },
          status: {
            not: 'cancelled',
          },
        },
        {
          OR: [
            {
              roomId: Number(data['roomId']),
            },
            {
              guestId: Number(data['guestId']),
            },
          ],
        },
      ],
    };
    if ('id' in data) {
      where.AND[0]['id'] = {
        not: Number(data['id']),
      };
    }
    const reservation = await prisma.reservation.findFirst({
      where,
    });
    if (reservation) {
      this.reason = 'この期間はすでに予約されています';
      return false;
    }

    return true;
  }

  defaultMessage() {
    if (this.reason) {
      return this.reason;
    }

    return '有効な値ではありません';
  }
}

export function IsReservable(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsReservableConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
class IsWithinLimitConstraint implements ValidatorConstraintInterface {
  private limit?: number;

  async validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'number') {
      return false;
    }

    const table = args.constraints[0] as Models;
    const id = `${table}Id`;
    const data = args.object as any;
    if (!(id in data) || typeof data[id] !== 'number') {
      return false;
    }

    const field = args.constraints[1];
    const prisma = new PrismaClient();
    const findFirst = prisma[table].findFirst as ((args?: { where: { id: number } }) => Promise<object | null>);
    const item = await findFirst({ where: { id: Number(data[id]) } });
    if (!item) {
      return false;
    }

    this.limit = Number(item[field]);
    return Number(value) <= this.limit;
  }

  defaultMessage() {
    if (this.limit === undefined) {
      return '有効な値ではありません';
    }

    return `${this.limit}以下を指定してください`;
  }
}

export function IsWithinLimit(table: Models, field: string, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table, field],
      validator: IsWithinLimitConstraint,
    });
  };
}
