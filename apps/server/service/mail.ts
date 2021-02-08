import type { MailOptions, MailSettings, MailAddress } from '$/types';
import { createTransport } from 'nodemailer';
import { htmlToText } from 'html-to-text';
import { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } from '$/service/env';

export const getSmtpOptions = (): MailOptions => ({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const getText = (text: string | undefined, html: string): string => text ?? htmlToText(html);
export const getMailSettings = ({ to, bcc, subject, html, text }: {
  to: MailAddress;
  bcc?: MailAddress;
  subject: string;
  html: string;
  text?: string;
}): MailSettings => ({
  from: SMTP_FROM,
  to,
  bcc,
  subject,
  html,
  text: getText(text, html),
});

export const send = async(options: MailOptions, settings: MailSettings): Promise<boolean> => {
  try {
    const transport = createTransport(options);
    const result = await transport.sendMail(settings);
    console.log(result);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
