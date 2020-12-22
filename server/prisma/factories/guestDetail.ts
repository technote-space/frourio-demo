import type { GuestDetailCreateInput } from '@prisma/client';
import { define } from '../tools/define';

define<GuestDetailCreateInput>('guestDetail', (faker => ({
  name: `${faker.name.findName()} ${faker.name.lastName()}`,
  nameKana: `${faker.name.findName()} ${faker.name.lastName()}`,
  zipCode: faker.address.zipCode(),
  address: `${faker.address.country()} ${faker.address.city()} ${faker.address.streetName()}`,
  phone: faker.phone.phoneNumber(),
})));
