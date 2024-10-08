import { env } from '@/env';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: env.AWS_REGION,
  credentials: {
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: env.AWS_ACCESS_KEY,
  },
});

type SendEmailCommandParams = {
  destination: {
    toAddresses: string[];
  };
  message: {
    body: {
      html: {
        data: string;
      };
    };
    subject: {
      data: string;
    };
  };
  source: string;
};

const createSendEmailCommand = (params: SendEmailCommandParams) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: params.destination.toAddresses,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: params.message.body.html.data,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: params.message.subject.data,
      },
    },
    Source: params.source,
  });
};

export { createSendEmailCommand, sesClient };
