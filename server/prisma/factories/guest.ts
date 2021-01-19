import { define } from '../tools/define';

define('guest', (faker => ({
  name: `${faker.name.lastName()} ${faker.name.firstName()}`,
  nameKana: `${faker.name.lastName()} ${faker.name.firstName()}`,
  zipCode: faker.address.zipCode(),
  address: `${faker.address.country()} ${faker.address.city()} ${faker.address.streetName()}`,
  phone: faker.phone.phoneNumber(),
})));
