import { define } from '../tools/define';

define('admin', (faker => ({
  name: `${faker.name.findName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.random.alpha(),
})));
