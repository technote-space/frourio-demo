/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from 'bunyan';
import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { sendError } from '$/utils/slack';

const dir = resolve(process.cwd(), 'logs');
mkdirSync(dir, { recursive: true });

const bunyanLogger = createLogger({
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
const logger = {
  debug: (...value: [any, ...any[]]) => bunyanLogger.debug(...value),
  error: (...value: [any, ...any[]]) => {
    bunyanLogger.error(...value);
    if (value && value[0] instanceof Error) {
      sendError(value[0]).then();
    }
  },
  info: (...value: [any, ...any[]]) => bunyanLogger.info(...value),
};

export { logger };
