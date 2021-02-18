import type Logger from 'bunyan';
import { createLogger } from 'bunyan';
import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { sendError } from '$/utils/slack';

const dir = resolve(process.cwd(), 'logs');
mkdirSync(dir, { recursive: true });

const _logger = createLogger({
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
/* istanbul ignore next */
const _error = (value?: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  _logger.error(value);
  if (value instanceof Error) {
    sendError(value);
  }
};
export const logger = {
  ..._logger,
  error: _error,
} as Logger;

export default logger;
