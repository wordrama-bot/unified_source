import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import { enqueue, createMessage } from '../utils/gameLoop';
import { AddFriend, UpdateFriend, RemoveFriend } from '../schema/friends';

async function getFriends(userId: string) {
  const { data, error } = await db
    .from('_friends')
    .select(
      `
      _players:friend_id (
        id,
        display_name,
        profile_image,
        _levels (
          level,
          xp
        ),
        _ledger (
          coin_balance
        )
      )
    `,
    )
    .eq('player', userId);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getRecievedFriendRequests(userId: string) {
  const { data, error } = await db
    .from('_friend_requests')
    .select(
      `
        id,
        _players:sending_player (
          id,
          display_name,
          profile_image,
          _levels (
            level,
            xp
          ),
          _ledger (
            coin_balance
          )
        ),
        status
      `,
    )
    .eq('receiving_player', userId);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getSentFriendRequests(userId: string) {
  const { data, error } = await db
    .from('_friend_requests')
    .select(
      `
        id,
        _players:receiving_player (
          id,
          display_name,
          profile_image,
          _levels (
            level,
            xp
          ),
          _ledger (
            coin_balance
          )
        ),
        status
      `,
    )
    .eq('sending_player', userId);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getFriendRequests(userId: string, direction: string = 'sent') {
  const { data, error } = await db
    .from('_friend_requests')
    .select(
      `
        id,
        sending_player,
        receiving_player,
        status
      `,
    )
    .eq(direction === 'sent' ? 'sending_player' : 'receiving_player', userId);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getFriendRequestById(requestId: string) {
  const { data, error } = await db
    .from('_friend_requests')
    .select(
      `
        id,
        sending_player,
        receiving_player,
        status
      `,
    )
    .eq('id', requestId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function addFriendRequest(userId: string, friendId: string) {
  const { data, error: friendRequestError } = await db
    .from('_friend_requests')
    .insert(
      changeKeys.snakeCase({
        sendingPlayer: userId,
        receivingPlayer: friendId,
      }),
    )
    .select('id, sending_player, receiving_player, status')
    .maybeSingle();

  console.log(data);

  if (friendRequestError) {
    console.error(friendRequestError);
    return {};
  }

  await enqueue([
    createMessage('FRIEND_INVITE', {
      userId,
    }),
  ]);

  return changeKeys.camelCase(data);
}

async function addFriend(userId: string, friendId: string) {
  const { data, error } = await db
    .from('_friends')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        friendId,
      }),
    )
    .select('id, player, friend_id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return { data: changeKeys.camelCase(data), error };
}

async function addFriendMapping(playerA: string, playerB: string) {
  const { error: errorA } = await addFriend(playerA, playerB);
  if (errorA) {
    console.error(errorA);
    return { error: errorA };
  }

  const { error: errorB } = await addFriend(playerB, playerA);
  if (errorB) {
    console.error(errorB);
    return { error: errorB };
  }

  return { data: {} };
}

async function updateFriendRequest(
  userId: string,
  requestId: string,
  status: string,
) {
  const { data, error: friendRequestError } = await db
    .from('_friend_requests')
    .update(
      changeKeys.snakeCase({
        status,
      }),
    )
    .eq('id', requestId)
    .eq('receiving_player', userId)
    .select('id, sending_player, receiving_player, status')
    .maybeSingle();

  if (friendRequestError) {
    console.error(friendRequestError);
    return {};
  }

  return changeKeys.camelCase(data);
}

async function deleteFriendRequest(userId: string, requestId: string) {
  const { error: friendRequestError } = await db
    .from('_friend_requests')
    .delete()
    .eq('id', requestId)
    .eq('receiving_player', userId)
    .maybeSingle();

  if (friendRequestError) {
    console.error(friendRequestError);
    return {};
  }

  return {
    requestId,
  };
}

async function acceptFriendRequest(userId: string, requestId: string) {
  const request = await getFriendRequestById(requestId);
  //@ts-ignore
  if (request.receivingPlayer !== userId) return {};

  await deleteFriendRequest(userId, requestId);
  //@ts-ignore
  const { error } = await addFriendMapping(
    request.sendingPlayer,
    request.receivingPlayer,
  );
  if (error) {
    console.error(error);
    return {};
  }

  //@ts-ignore
  return { requestId, status: 'accepted' };
}

async function declineFriendRequest(userId: string, requestId: string) {
  //const updated = await updateFriendRequest(userId, requestId, 'declined');
  const updated = await deleteFriendRequest(userId, requestId);
  if (!updated) return {};

  return { requestId };
}

async function cancelFriendRequest(userId: string, requestId: string) {
  const { data, error } = await db
    .from('_friend_requests')
    .delete()
    .select()
    .eq('id', requestId)
    .eq('sending_player', userId);

  if (error) {
    console.error(error);
    return {};
  }

  return { requestId };
}

async function removeFriend(userId: string, friendId: string) {
  const { data: dataA, error: errorA } = await db
    .from('_friends')
    .delete()
    .select()
    .eq('friend_id', friendId)
    .eq('player', userId)
    .maybeSingle();

  const { data: dataB, error: errorB } = await db
    .from('_friends')
    .delete()
    .select()
    .eq('player', friendId)
    .eq('friend_id', userId)
    .maybeSingle();

  if (errorA || errorB) {
    console.error(errorA, errorB);
    return {};
  }

  return { ...dataA };
}

export default {
  getFriends,
  getFriendRequests,
  getSentFriendRequests,
  getRecievedFriendRequests,
  getFriendRequestById,
  addFriendRequest,
  updateFriendRequest,
  deleteFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
};
