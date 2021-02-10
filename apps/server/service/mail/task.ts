import type { MailOptions, MailSettings } from '$/types';
import { createTransport } from 'nodemailer';
import { logger } from '$/service/logging';

process.once('message', (message: { options: MailOptions; settings: MailSettings; }) => {
  const transport = createTransport(message.options);
  transport.sendMail(message.settings, (error, result) => {
    if (error) {
      logger.error(error);
    } else {
      logger.debug(result);
    }
  });
});
