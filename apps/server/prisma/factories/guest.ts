import { define } from '../tools/define';

define('guest', (faker => ({
  email: `${faker.random.number()}${faker.random.number()}@example.com`,
  name: `${faker.name.lastName()} ${faker.name.firstName()}`,
  nameKana: 'テスト テスト',
  zipCode: faker.address.zipCode(),
  address: `${faker.address.country()} ${faker.address.city()} ${faker.address.streetName()}`,
  phone: faker.phone.phoneNumber(),
})));
