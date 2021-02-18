import { createLogger } from 'bunyan';
import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { sendError } from '$/utils/slack';

const dir = resolve(process.cwd(), 'logs');
mkdirSync(dir, { recursive: true });

const logger = createLogger({
  name: 'system',
  streams: [{
    type: 'rotating-file',
    path: resolve(dir, 'system.log'),
    period: '1d',
    count: 10,
  }],
  src: true,
  level: process.env.NODE_ENV === 'development' ? /* istanbul ignore next */ 'debug' : 'info',
});
const errorLog = logger.error;

/* istanbul ignore next */
const _error = (value?: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  errorLog(value);
  if (value instanceof Error) {
    sendError(value);
  }

  return true;
};
logger.error = _error;

export { logger };
