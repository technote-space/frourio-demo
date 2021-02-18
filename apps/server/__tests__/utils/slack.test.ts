import { sendError, sendOk } from '$/utils/slack';
import { getPromiseLikeItem } from '$/__tests__/utils';
import { IncomingWebhook } from '@slack/webhook';
import * as env from '$/utils/env';

const IncomingWebhookMock = IncomingWebhook as jest.Mock;

describe('sendError', () => {
  it('should send error', async() => {
    const sendMock = jest.fn();
    IncomingWebhookMock.mockImplementation(() => ({ send: sendMock }));
    Object.defineProperty(env, 'SLACK_WEBHOOK_URL', { value: 'example.com' });
    await sendError(new Error('test error'));
    expect(sendMock).toBeCalledWith({
      username: 'Slack Bot',
      text: 'test error',
      'icon_emoji': 'no_entry',
      attachments: [{
        color: 'danger',
        text: expect.any(String),
      }],
    });
  });

  it('should not send error', async() => {
    const sendMock = jest.fn();
    IncomingWebhookMock.mockImplementation(() => ({ send: sendMock }));
    Object.defineProperty(env, 'SLACK_WEBHOOK_URL', { value: '' });
    await sendError(new Error('test error'));
    expect(sendMock).not.toBeCalled();
  });
});

describe('sendOk', () => {
  it('should send error', async() => {
    const sendMock = jest.fn();
    IncomingWebhookMock.mockImplementation(() => ({ send: sendMock }));
    Object.defineProperty(env, 'SLACK_WEBHOOK_URL', { value: 'example.com' });
    await sendOk('test message', [{ title: 'test title', value: 'test value', short: true }]);
    expect(sendMock).toBeCalledWith({
      username: 'Slack Bot',
      text: 'test message',
      attachments: [{
        color: 'good',
        fields: [{
          title: 'test title',
          value: 'test value',
          short: true,
        }],
      }],
    });
  });

  it('should not send error', async() => {
    const sendMock = jest.fn(() => getPromiseLikeItem({}));
    IncomingWebhookMock.mockImplementation(() => ({ send: sendMock }));
    Object.defineProperty(env, 'SLACK_WEBHOOK_URL', { value: '' });
    await sendOk('test message', [{ title: 'test title', value: 'test value', short: true }]);
    expect(sendMock).not.toBeCalled();
  });
});
