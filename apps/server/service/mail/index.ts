import type { MailOptions, MailSettings, MailAddress } from '$/types';
import type { Primitive } from '@frourio-demo/types';
import { fork } from 'child_process';

import { htmlToText } from 'html-to-text';
import { FRONT_URL, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_BCC } from '$/service/env';
import { replaceVariables } from '@frourio-demo/utils/string';
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

export const send = async(options: MailOptions, settings: MailSettings) => {
  const child = fork(
    'tasks/mail.js',
    [],
    { execArgv: ['-r', 'ts-node/register'] },
  );
  child.send({ options, settings });
};

export const getTemplateVariables = () => ({
  'head': HeadTemplate,
  'header': HeaderTemplate,
  'footer': FooterTemplate,
});
export const getCommonVariables = () => ({
  'logo_url': `${FRONT_URL}/favicon.png`,
  'top_link': `${FRONT_URL}`,
  'terms_link': `${FRONT_URL}/terms`,
  'privacy_link': `${FRONT_URL}/privacy`,
  'contact_link': `${FRONT_URL}/contact`,
});
export const sendHtmlMail = async(to: MailAddress, subject: string, template: string, variables?: Record<string, Primitive>) => send(getSmtpOptions(), getMailSettings({
  to,
  bcc: SMTP_BCC,
  subject,
  html: replaceVariables(replaceVariables(template, getTemplateVariables()), {
    ...getCommonVariables(),
    ...variables,
  }),
}));
