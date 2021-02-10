import { createLogger } from 'bunyan';
import { resolve } from 'path';

export const logger = createLogger({
  name: 'system',
  streams: [{
    type: 'rotating-file',
    path: resolve(process.cwd(), 'logs', 'system.log'),
    period: '1d',
    count: 10,
  }],
  src: true,
  level: process.env.NODE_ENV === 'development' ? /* istanbul ignore next */ 'debug' : 'warn',
});

export default logger;
