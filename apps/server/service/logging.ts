import { createLogger } from 'bunyan';
import { resolve } from 'path';
import { mkdirSync } from 'fs';

const dir = resolve(process.cwd(), 'logs');
mkdirSync(dir, { recursive: true });

export const logger = createLogger({
  name: 'system',
  streams: [{
    type: 'rotating-file',
    path: resolve(dir, 'system.log'),
    period: '1d',
    count: 10,
  }],
  src: true,
  level: process.env.NODE_ENV === 'development' ? /* istanbul ignore next */ 'debug' : 'warn',
});

export default logger;
