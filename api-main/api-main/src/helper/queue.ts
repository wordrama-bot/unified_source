import { serviceBusClient } from '../';

export async function sendMessageToQueue(queueName: string, message: any) {
  const sender = serviceBusClient.createSender(queueName);
  try {
      await sender.sendMessages([{ body: message }]);
  } catch (error) {
      console.error("Error sending message to queue:", error);
  } finally {
      await sender.close();
  }
}

/*
sendMessageToQueue(queueName, messageToSend)
    .then(() => console.log("Message sent to queue."))
    .catch(error => console.error("Error sending message to queue:", error));
*/