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
  async validate(value: any, args: ValidationArguments) {
    const data = args.object as any;
    if (!('roomId' in data) || typeof data['roomId'] !== 'number') {
      return false;
    }

    const checkin     = new Date(data['checkin']);
    const checkout    = new Date(data['checkout']);
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

    return !reservation && checkin.getDate() < checkout.getDate();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Not Reservable';
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
    return item !== null && Number(value) <= Number(item[field]);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Not within the limitation';
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
