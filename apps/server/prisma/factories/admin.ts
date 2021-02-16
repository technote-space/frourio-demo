import { define } from '../tools/define';

define('admin', (faker => ({
  name: `${faker.name.findName()} ${faker.name.lastName()}`,
  email: `${faker.random.number()}${faker.random.number()}@example.com`,
  password: faker.random.alpha(),
})));
