const {
  delay,
  ServiceBusClient,
  ServiceBusMessage,
} = require('@azure/service-bus');

const connectionString =
  process.env.SERVICE_BUS_CONNECTION_STRING;

const topicName = 'game-loop';
const subscriptionName = 'check-player-challenges';
const client = new ServiceBusClient(connectionString);

const serviceUrl = 'https://api.wordrama.io';
const servicePath = 'api/v3/';
const serviceAuth = `?authMethod=SERVICE_TOKEN&apiKey=jg4nbCTbqjTuqXSx7oHZ69&userId=`;

async function send(messages) {
  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender(topicName);

  try {
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
    console.log(`Sent a batch of messages to the topic: ${topicName}`);
    await sender.close();
  } finally {
    await sbClient.close();
  }
}

async function getChallenges(userId) {
  const result = await fetch(
    `${serviceUrl}/${servicePath}/challenges/me${serviceAuth}${userId}`,
  ).then((response) => response.json());

  if (result.status !== 200) {
    console.error(result?.message);
    return {};
  }

  return result;
}

async function handleUpdateChallengeProgress(
  challengeId,
  userId,
  status,
  progress,
) {
  return await fetch(
    [
      serviceUrl,
      servicePath,
      '_system/challenges',
      challengeId,
      'progress',
      `${serviceAuth}${userId}&status=${status}&progress=${progress}`,
    ].join('/'),
    {
      method: 'POST',
    },
  ).then((response) => response.json());
}

async function handleFirstWordleGameChallenge(userId, challenges) {
  const challengeId = '6e0b4736-434f-441a-bd15-f1e6af871a9c';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;
  else if (challenge && challenge?.status !== 'LOCKED') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handleFirstGameChallenge(userId, challenges) {
  const challengeId = '4d8b44d9-c06d-4eb1-8a13-68273649acee';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;
  else if (challenge && challenge?.status !== 'LOCKED') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handle100GamesChallenge(userId, challenges) {
  const challengeId = '930824d0-e727-45a0-b7d7-ae366ddd9aaa';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;
  else if (challenge && challenge?.status !== 'LOCKED') return;

  const { data } = await fetch(
    [
      serviceUrl,
      servicePath,
      'leaderboard/wordle/stats/all-time',
      `${serviceAuth}${userId}`,
    ].join('/'),
    {
      method: 'POST',
    },
  ).then((response) => response.json());

  if (data && data?.gamesPlayed < 100) {
    await handleUpdateChallengeProgress(
      challengeId,
      userId,
      'IN_PROGRESS',
      Math.ceil(data?.gamesPlayed / 100),
    );
  }

  if (data && data?.gamesPlayed >= 100) {
    await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
  }
}

const CHAMPION_CHALLENGES = [
  {
    challengeId: '4a73b85a-9e40-4ed4-a55d-a7de4ce20f8a',
    period: 'daily',
    rankPrefix: 'dailyRank',
    name: 'Daily Champion',
  },
  {
    challengeId: '3beaa47f-5638-4ba2-a42a-b45f3cb5b6bf',
    period: 'weekly',
    rankPrefix: 'weeklyRank',
    name: 'Weekly Champion',
  },
  {
    challengeId: '0af08641-fbe3-454d-b21f-8f2cbdfdb28a',
    period: 'monthly',
    rankPrefix: 'monthlyRank',
    name: 'Monthly Champion',
  },
  {
    challengeId: '95bb2ed7-c13b-4231-9625-e403725a5693',
    period: 'yearly',
    rankPrefix: 'yearlyRank',
    name: 'Yearly Champion',
  },
  {
    challengeId: 'eb7590cc-d2a8-4952-a5e5-17e2bbe15202',
    period: 'all-time',
    rankPrefix: 'alltimeRank',
    name: 'All-Time Champion',
  },
];

function hasRankOne(data, rankPrefix) {
  return Object.entries(data).some(
    ([key, value]) =>
      key.startsWith(rankPrefix) &&
      Number(value) === 1,
  );
}

async function handleChampionChallenge(
  userId,
  challenges,
  {
    challengeId,
    period,
    rankPrefix,
    name,
  },
) {
  const challenge = challenges?.find(
    (c) => c.id === challengeId,
  );

  if (challenge?.status === 'COMPLETE') return;

  const response = await fetch(
    [
      serviceUrl,
      servicePath,
      'leaderboard/wordle/position',
      period,
      userId,
    ].join('/'),
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    console.error(
      `Failed to check ${name} challenge for ${userId}:`,
      response.status,
      response.statusText,
    );
    return;
  }

  const { data } = await response.json();

  if (!data || !hasRankOne(data, rankPrefix)) return;

  await handleUpdateChallengeProgress(
    challengeId,
    userId,
    'COMPLETE',
    100,
  );
}

async function handleChampionChallenges(userId, challenges) {
  for (const config of CHAMPION_CHALLENGES) {
    await handleChampionChallenge(
      userId,
      challenges,
      config,
    );
  }
}

async function handleGetItInChallenge(userId, challenges, guessCount) {
  const challengeIds = {
    1: '5bc14e33-c61e-41ed-bdd5-f008ef3cdc69',
    2: 'd298a278-583f-4470-ae2d-f214b14d3a29',
    3: '1b3fc220-585b-4f1b-9dc9-e5753c791078',
    4: '30e18999-303c-4ab6-b5dc-559b757c1903',
    5: 'c9f2f782-6b9e-471a-9c36-41946ddaa600',
    6: 'f3f24c6e-913c-4893-a74f-d28d2a0dd179',
  };
  const challengeId = challengeIds[guessCount];
  if (!challengeId) return;
  const challenge = challenges.find((c) => c.id === challengeId);

  if (challenge && challenge?.status === 'COMPLETE') return;
  else if (challenge && challenge?.status !== 'LOCKED') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handleLostChallenge(userId, challenges) {
  const challengeId = 'f6fcebf0-97c9-4374-98f8-062a737b8601';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handleNewPlayerChallenge(userId, challenges) {
  const challengeId = 'f3675b82-0d1e-450f-aa53-37c3e958a5d6';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handleKebabChallenge(userId, challenges) {
  const challengeId = 'd82d4465-5d6a-4a92-9256-06933522a754';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handleFriendInviteChallenge(userId, challenges) {
  const challengeId = '1c897692-483d-4e48-99bb-3d0227201c13';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;

  await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
}

async function handleUsernameChallenge(userId, challenges) {
  const challengeId = 'f3675b82-0d1e-450f-aa53-37c3e958a5d6';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;

  const { data } = await fetch(
    `${serviceUrl}/${servicePath}player/me${serviceAuth}${userId}`,
    {
      method: 'GET',
    },
  ).then((response) => response.json());

  if (data && data?.displayName) {
    await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
  }
}

async function handleProfileImageChallenge(userId, challenges) {
  const challengeId = 'f3675b82-0d1e-450f-aa53-37c3e958a5d6';
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge && challenge?.status === 'COMPLETE') return;

  const { data } = await fetch(
    `${serviceUrl}/${servicePath}player/me${serviceAuth}${userId}`,
    {
      method: 'GET',
    },
  ).then((response) => response.json());

  if (data && data?.profileImage) {
    await handleUpdateChallengeProgress(challengeId, userId, 'COMPLETE', 100);
  }
}

async function main() {
  console.log('Waiting for messages');
  let counter = 0;
  while (true) {
    try {
      const receiver = client.createReceiver(topicName, subscriptionName);
      receiver.subscribe({
        processMessage: async function (messageReceived) {
          counter = 0;
          console.log(`Processing message`);
          const challenges = await getChallenges(messageReceived.body.userId);
          switch (messageReceived.body.type) {
            case 'FRIEND_INVITE':
              await handleFriendInviteChallenge(
                messageReceived.body.userId,
                challenges?.data,
              );
              break;
            case 'PURCHASED_ITEM':
              break;
            case 'CHECK_WORDLE_CHALLENGES':
              if (messageReceived.body.metadata.guesses.includes('KEBAB')) {
                await handleKebabChallenge(
                  messageReceived.body.userId,
                  challenges?.data,
                );
              }
              await handleFirstWordleGameChallenge(
                messageReceived.body.userId,
                challenges?.data,
              );
              await handleFirstGameChallenge(
                messageReceived.body.userId,
                challenges?.data,
              );
              await handleChampionChallenges(
                messageReceived.body.userId,
                challenges?.data,
              );
              // await handle100GamesChallenge(
              //   messageReceived.body.userId,
              //   challenges?.data,
              // );
              if (
                messageReceived.body.metadata.guesses.includes(
                  messageReceived.body.metadata.solution,
                )
              ) {
                await handleGetItInChallenge(
                  messageReceived.body.userId,
                  challenges?.data,
                  messageReceived.body.metadata.guessCount,
                );
              } else {
                await handleLostChallenge(
                  messageReceived.body.userId,
                  challenges?.data,
                );
              }

              break;
            case 'NEW_PLAYER_SIGN_UP':
              await handleNewPlayerChallenge(
                messageReceived.body.userId,
                challenges?.data,
              );
              await handleUsernameChallenge(
                messageReceived.body.userId,
                challenges?.data,
              );
              break;
            default:
              console.log('Unknown message type');
              break;
          }
        },
        processError: async function errorHandler(error) {
          console.error(error);
        },
      });

      // Waiting long enough before closing the sender to send messages
      console.log(`Sleeping for ${5 + counter} seconds`);
      await delay(5000 + counter * 1000);
      if (counter <= 55) {
        counter++;
      }

      await receiver.close();
    } catch (error) {
      console.error('Error processing event');
    }
  }
}

// call the main function
main().catch(async (err) => {
  await client.close();
  console.log('Error occurred: ', err);
  process.exit(1);
});
