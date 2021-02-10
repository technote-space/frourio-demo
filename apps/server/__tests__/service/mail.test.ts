import nodemailer from 'nodemailer';
import { getSmtpOptions, getText, getMailSettings, send, sendHtmlMail } from '$/service/mail';
import * as env from '$/service/env';

jest.mock('nodemailer');

beforeEach(() => {
  jest.resetModules();
});

describe('getSmtpOptions', () => {
  it('should return smtp options', () => {
    Object.defineProperty(env, 'SMTP_HOST', { value: 'example.com' });
    Object.defineProperty(env, 'SMTP_PORT', { value: 25 });
    Object.defineProperty(env, 'SMTP_SECURE', { value: false });
    Object.defineProperty(env, 'SMTP_USER', { value: 'user' });
    Object.defineProperty(env, 'SMTP_PASS', { value: 'pass' });

    expect(getSmtpOptions()).toEqual({
      host: 'example.com',
      port: 25,
      secure: false,
      auth: {
        user: 'user',
        pass: 'pass',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  });
});

describe('getText', () => {
  it('should return text', () => {
    expect(getText('text', 'html')).toBe('text');
    expect(getText(undefined, 'html')).toBe('html');
  });
});

describe('getMailSettings', () => {
  it('should return mail settings', () => {
    Object.defineProperty(env, 'SMTP_FROM', { value: 'from@example.com' });

    expect(getMailSettings({
      to: ['to1@example.com', { name: 'to2', address: 'to2@example.com' }],
      bcc: 'bcc@example.com',
      subject: 'test subject',
      html: 'html',
    })).toEqual({
      from: 'from@example.com',
      to: ['to1@example.com', { name: 'to2', address: 'to2@example.com' }],
      bcc: 'bcc@example.com',
      subject: 'test subject',
      html: 'html',
      text: 'html',
    });
  });
});

describe('send', () => {
  it('should call sendMail method', async() => {
    console.log = jest.fn();
    const mockSendMail = jest.fn();
    const spyOn = jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => ({
      sendMail: mockSendMail,
    }) as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(await send({}, getMailSettings({
      to: 'to@example.com',
      bcc: 'bcc@example.com',
      subject: 'test subject',
      html: 'html',
    }))).toBe(true);
    expect(spyOn).toBeCalledTimes(1);
    expect(mockSendMail).toBeCalledTimes(1);
  });

  it('should catch error', async() => {
    console.error = jest.fn();
    const mockSendMail = jest.fn(() => {
      throw new Error();
    });
    const spyOn = jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => ({
      sendMail: mockSendMail,
    }) as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(await send({}, getMailSettings({
      to: 'to@example.com',
      bcc: 'bcc@example.com',
      subject: 'test subject',
      html: 'html',
    }))).toBe(false);
    expect(spyOn).toBeCalledTimes(1);
    expect(mockSendMail).toBeCalledTimes(1);
  });
});

describe('sendHtmlMail', () => {
  it('should call sendMail method', async() => {
    Object.defineProperty(env, 'SMTP_FROM', { value: 'from@example.com' });
    Object.defineProperty(env, 'FRONT_URL', { value: 'http://example.com' });
    console.log = jest.fn();
    const mockSendMail = jest.fn();
    const spyOn = jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => ({
      sendMail: mockSendMail,
    }) as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(await sendHtmlMail(
      'to@example.com',
      'test subject',
      '${logo_url}::${top_link}::${terms_link}::${privacy_link}::${contact_link}::${head}::${header}::${footer}',
    )).toBe(true);
    expect(spyOn).toBeCalledTimes(1);
    expect(mockSendMail).toBeCalledWith({
      from: 'from@example.com',
      to: 'to@example.com',
      bcc: [],
      subject: 'test subject',
      html: 'http://example.com/favicon.png::http://example.com::http://example.com/terms::http://example.com/privacy::http://example.com/contact::Head::Header::Footer',
      text: 'http://example.com/favicon.png::http://example.com::http://example.com/terms::http://example.com/privacy::http://example.com/contact::Head::Header::Footer',
    });
  });
});
