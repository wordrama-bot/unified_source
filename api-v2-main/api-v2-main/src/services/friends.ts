import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import { enqueue, createMessage } from '../utils/gameLoop';
import { newFriendRequest } from '../schema/friends.js';

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

type FriendActionResult = { id?: string; requestId?: string; status?: string; [key: string]: unknown };

async function friendAction(userId: string, targetId: string, action: string): Promise<FriendActionResult> {
  const valid = newFriendRequest.safeParse({ friendId: targetId });
  if (!valid.success) return {};
  const { data, error } = await db.rpc('wordrama_friend_action', {
    p_player: userId, p_target: valid.data.friendId, p_action: action,
  });
  if (error) {
    console.error('[friends] transaction failed', error);
    return {};
  }
  // Fail closed if the function is absent or the acknowledgement is malformed.
  if (!data || (['invite','remove'].includes(action)
    ? !data.id : data.requestId !== valid.data.friendId || data.status !== ({
      accept: 'accepted', decline: 'declined', cancel: 'cancelled',
    } as Record<string, string>)[action])) return {};
  return changeKeys.camelCase(data, 10) as FriendActionResult;
}

async function addFriendRequest(userId: string, friendId: string) {
  const valid = newFriendRequest.safeParse({ friendId });
  if (!valid.success || valid.data.friendId === userId.toLowerCase()) {
    return { error: 'Invalid friend target' };
  }
  const data = await friendAction(userId, valid.data.friendId, 'invite');
  if (!data.id) return { error: 'Unable to add friend request' };
  // A notification outage must not report a committed invitation as failed.
  try {
    await enqueue([createMessage('FRIEND_INVITE', { userId })]);
  } catch (error) { console.error('[friends] invitation notification failed', error); }
  return data;
}

const acceptFriendRequest = (userId: string, requestId: string) => friendAction(userId, requestId, 'accept');
const declineFriendRequest = (userId: string, requestId: string) => friendAction(userId, requestId, 'decline');
const cancelFriendRequest = (userId: string, requestId: string) => friendAction(userId, requestId, 'cancel');
const removeFriend = (userId: string, friendId: string) => friendAction(userId, friendId, 'remove');

export default {
  getFriends, getFriendRequests, getSentFriendRequests, getRecievedFriendRequests,
  getFriendRequestById, addFriendRequest, acceptFriendRequest,
  declineFriendRequest, cancelFriendRequest, removeFriend,
};
