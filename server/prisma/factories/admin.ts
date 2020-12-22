import type { AdminCreateInput } from '@prisma/client';
import { define } from '../tools/define';

define<AdminCreateInput>('admin', (faker => ({
  name: `${faker.name.findName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.random.alpha(),
})));
