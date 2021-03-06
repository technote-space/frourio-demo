import type { IncomingWebhookSendArguments } from '@slack/webhook';
import { IncomingWebhook } from '@slack/webhook';
import { SLACK_WEBHOOK_URL } from '$/config/env';

export const sendError = async(error: Error) => send({
  username: 'Slack Bot',
  text: error.message,
  'icon_emoji': 'no_entry',
  attachments: [{
    color: 'danger',
    text: error.stack,
  }],
});

export const sendOk = async(text: string, fields?: { title: string; value: string; short?: boolean }[]) => send({
  username: 'Slack Bot',
  text,
  attachments: [{
    color: 'good',
    fields,
  }],
});

export const send = async(args: IncomingWebhookSendArguments) => {
  if (!SLACK_WEBHOOK_URL) {
    return;
  }

  const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);
  return webhook.send(args);
};
