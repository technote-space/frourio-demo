import { define } from '../tools/define';

define('room', (faker => ({
  name: faker.name.firstName() + faker.random.number(),
  number: faker.random.number({ min: 1, max: 10 }),
  price: faker.random.number({ min: 1000, max: 100000 }),
})));
