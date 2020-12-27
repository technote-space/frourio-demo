/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { Models } from '.';

@ValidatorConstraint({ async: true })
class IsIdExistsConstrains implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'number') {
      return false;
    }

    const table     = args.constraints[0] as Models;
    const prisma    = new PrismaClient();
    const findFirst = prisma[table].findFirst as ((args?: { where: { id: number } }) => Promise<object | null>);
    const item      = await findFirst({ where: { id: Number(value) } });
    return item !== null;
  }

  defaultMessage(args: ValidationArguments) {
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
      validator: IsIdExistsConstrains,
    });
  };
}

@ValidatorConstraint({ async: true })
class IsReservableConstrains implements ValidatorConstraintInterface {
  private reason?: string;

  async validate(value: any, args: ValidationArguments) {
    const data = args.object as any;
    if (!('roomId' in data) || typeof data['roomId'] !== 'number') {
      return false;
    }

    const checkin  = new Date(data['checkin']);
    const checkout = new Date(data['checkout']);
    if (checkin.getDate() >= checkout.getDate()) {
      this.reason = 'The checkin time must be before the checkout time.';
      return false;
    }

    const prisma      = new PrismaClient();
    const reservation = await prisma.reservation.findFirst({
      where: {
        roomId: Number(data['roomId']),
        checkin: {
          lt: checkout,
        },
        checkout: {
          gt: checkin,
        },
      },
    });
    if (reservation) {
      this.reason = 'This period is already reserved.';
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    if (this.reason) {
      return this.reason;
    }

    return 'Invalid value';
  }
}

export function IsReservable(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsReservableConstrains,
    });
  };
}

@ValidatorConstraint({ async: true })
class IsWithinLimitConstrains implements ValidatorConstraintInterface {
  private limit?: number;

  async validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'number') {
      return false;
    }

    const table = args.constraints[0] as Models;
    const id    = `${table}Id`;
    const data  = args.object as any;
    if (!(id in data) || typeof data[id] !== 'number') {
      return false;
    }

    const field     = args.constraints[1];
    const prisma    = new PrismaClient();
    const findFirst = prisma[table].findFirst as ((args?: { where: { id: number } }) => Promise<object | null>);
    const item      = await findFirst({ where: { id: Number(data[id]) } });
    if (!item) {
      return false;
    }

    this.limit = Number(item[field]);
    return item !== null && Number(value) <= this.limit;
  }

  defaultMessage(args: ValidationArguments) {
    if (this.limit === undefined) {
      return 'Invalid value';
    }

    return 'The value must be less than or equal to ' + this.limit;
  }
}

export function IsWithinLimit(table: Models, field: string, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table, field],
      validator: IsWithinLimitConstrains,
    });
  };
}
