import type { MailOptions, MailSettings } from '$/types';
import { createTransport } from 'nodemailer';
import { logger } from '$/service/logging';

process.once('message', (message: { options: string; settings: string; }) => {
  const options = JSON.parse(message.options) as MailOptions;
  const settings = JSON.parse(message.settings) as MailSettings;
  const transport = createTransport(options);
  transport.sendMail(settings, (error, result) => {
    if (error) {
      logger.error(error);
    } else {
      logger.debug(result);
    }
  });
});
