import { ServiceBusClient } from '@azure/service-bus';

// TODO: Move to environment variables
const connectionString =
  process.env.SERVICE_BUS_CONNECTION_STRING;

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
  //console.log(`[GAME LOOP] Processing message`);
  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender('game-loop');

  try {
    if (messages.length === 1) {
      // console.log(`[GAME LOOP] Sending single message`);
      await sender.sendMessages(messages);
      await sender.close();
      await sbClient.close();
      return;
    }

    let batch = await sender.createMessageBatch();
    for (let i = 0; i < messages.length; i++) {
      if (!batch.tryAddMessage(messages[i])) {
        await sender.sendMessages(batch);
        batch = await sender.createMessageBatch();

        if (!batch.tryAddMessage(messages[i])) {
          throw new Error('Message too big to fit in a batch');
        }
      }
    }

    await sender.sendMessages(batch);
    await sender.close();
  } finally {
    await sbClient.close();
  }
}
