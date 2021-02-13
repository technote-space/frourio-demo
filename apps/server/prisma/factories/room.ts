import { define } from '../tools/define';
import { generateRoomKey } from '$/utils/reservation';

define('room', (faker => ({
  name: faker.name.firstName() + faker.random.number(),
  number: faker.random.number({ min: 1, max: 10 }),
  price: faker.random.number({ min: 1000, max: 100000 }),
  key: generateRoomKey(),
})));
