import { ServiceBusClient } from '@azure/service-bus';

// TODO: Move to environment variables
const connectionString =
  process.env.SERVICE_BUS_CONNECTION_STRING;

let hasWarnedMissingServiceBus = false;

export function createMessage(type = '', content) {
  if (!type)
    return {
      body: content,
    };

  return {
    body: {
      ...content,
      type,
    },
  };
}

export async function enqueue(messages) {
  if (!connectionString) {
    if (!hasWarnedMissingServiceBus) {
      console.warn(
        '[GAME LOOP] SERVICE_BUS_CONNECTION_STRING missing, skipping enqueue'
      );
      hasWarnedMissingServiceBus = true;
    }

    return;
  }

  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender('game-loop');

  try {
    if (messages.length === 1) {
      await sender.sendMessages(messages);
      return;
    }

    let batch = await sender.createMessageBatch();

    for (const message of messages) {
      if (!batch.tryAddMessage(message)) {
        await sender.sendMessages(batch);
        batch = await sender.createMessageBatch();

        if (!batch.tryAddMessage(message)) {
          throw new Error('Message too big to fit in a batch');
        }
      }
    }

    if (batch.count > 0) {
      await sender.sendMessages(batch);
    }
  } finally {
    await sender.close();
    await sbClient.close();
  }
}
