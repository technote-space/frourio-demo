import type { MailAddress, MailOptions, MailSettings } from '$/types';
import { createTransport } from 'nodemailer';
import { logger } from '$/service/logging';

const isTestAddress = (to: MailAddress): boolean => {
  if (Array.isArray(to)) {
    return to.some(to => isTestAddress(to));
  }

  if (typeof to === 'object') {
    return isTestAddress(to.address);
  }

  return /example\.com/.test(to);
};
process.once('message', (message: { options: MailOptions; settings: MailSettings; }) => {
  if (isTestAddress(message.settings.to)) {
    logger.debug(`test address: ${JSON.stringify(message.settings.to)}`);
    logger.debug(message.settings.text);
    return;
  }

  const transport = createTransport(message.options);
  transport.sendMail(message.settings, (error, result) => {
    if (error) {
      logger.error(error);
    } else {
      logger.debug(result);
    }
  });
});
