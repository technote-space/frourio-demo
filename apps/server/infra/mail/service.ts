/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reservation } from '$/domain/database/reservation';
import type { MailOptions, MailSettings, MailAddress } from '$/domain/mail';
import type { Primitive } from '@frourio-demo/types';
import { fork } from 'child_process';
import { htmlToText } from 'html-to-text';
import { format } from 'date-fns';
import sanitizeHtml from 'sanitize-html';
import { replaceVariables } from '@frourio-demo/utils/string';
import { getReplaceVariables } from '@/utils/value';
import { FRONT_URL, SMTP_BCC, SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER } from '$/config/env';
import HeadTemplate from './templates/Head.html';
import HeaderTemplate from './templates/Header.html';
import FooterTemplate from './templates/Footer.html';


export const getSmtpOptions = (): MailOptions => ({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
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

export const getTemplateVariables = () => ({
  'head': HeadTemplate,
  'header': HeaderTemplate,
  'footer': FooterTemplate,
});
export const getCommonVariables = () => ({
  'logo_url': `${FRONT_URL}/favicon.png`,
  'top_link': `${FRONT_URL}`,
  'contact_link': `${FRONT_URL}/contact`,
});

export const send = async(options: MailOptions, settings: MailSettings): Promise<boolean> => {
  const child = fork(
    'tasks/mail.js',
    [],
    { execArgv: ['-r', 'ts-node/register'] },
  );
  return child.send({ options, settings });
};

export const sendHtmlMail = async(to: MailAddress, subject: string, template: string, variables?: Record<string, Primitive>): Promise<boolean> => send(getSmtpOptions(), getMailSettings({
  to,
  bcc: SMTP_BCC,
  subject: `【Frourioの宿】${subject}`,
  html: replaceVariables(replaceVariables(template, getTemplateVariables()), {
    ...getCommonVariables(),
    ...Object.fromEntries(Object.entries(variables ?? {}).map(([key, value]) => [key, typeof value === 'string' ? sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    }) : value])),
  }),
}));

const processReservationVariable = (key: string, value: any) => {
  switch (key) {
    case 'checkin':
    case 'checkout':
      return format(value as Date, 'yyyy/MM/dd HH:mm');
    case 'number':
      return `${value}人`;
    case 'amount':
      return `¥${value.toLocaleString()}`;
    default:
      return value;
  }
};
export const getReservationVariables = (reservation: Reservation & Record<string, any>) => getReplaceVariables(Object.fromEntries(Object.entries(reservation).map(([key, value]) => [key, processReservationVariable(key, value)])), key => `reservation.${key}`);
