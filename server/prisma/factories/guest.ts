import type { GuestCreateInput } from '@prisma/client';
import { define } from '../tools/define';

define<GuestCreateInput>('guest', (faker => ({
  name: `${faker.name.findName()} ${faker.name.lastName()}`,
  nameKana: `${faker.name.findName()} ${faker.name.lastName()}`,
  zipCode: faker.address.zipCode(),
  address: `${faker.address.country()} ${faker.address.city()} ${faker.address.streetName()}`,
  phone: faker.phone.phoneNumber(),
})));
