import { type Response } from 'express';
import { ApiRequest } from '../types';
import { db } from '../models';
import {
  notFoundResponse,
  badRequest,
  successfulResponse,
} from '../utils/responses';
import {
  newFriendRequest as newFriendRequestSchema,
  NewFriendRequest,
} from '../schema/friends';

import friendsService from '../services/friends';

async function getFriends(req: ApiRequest, res: Response) {
  const friends = await friendsService.getFriends(req.userId);
  if (!friends || friends.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    friends,
    'Friends returned',
    friends.length,
  );
}

async function getSentFriendRequests(req: ApiRequest, res: Response) {
  const friendRequests = await friendsService.getSentFriendRequests(req.userId);
  if (!friendRequests || friendRequests.length === 0)
    return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    friendRequests,
    'Friend sent requests returned',
    friendRequests.length,
  );
}

async function getRecievedFriendRequests(req: ApiRequest, res: Response) {
  const friendRequests = await friendsService.getRecievedFriendRequests(
    req.userId,
  );

  if (!friendRequests || friendRequests.length === 0)
    return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    friendRequests,
    'Friend recieved requests returned',
    friendRequests.length,
  );
}

async function getFriendRequests(req: ApiRequest, res: Response) {
  const validDirections = ['sent', 'received'];
  const { direction } = req.query;
  if (!direction || !validDirections.includes(direction))
    return badRequest(req, res, 'Invalid direction [sent, received]');

  const friendRequests = await friendsService.getFriendRequests(
    req.userId,
    direction,
  );
  if (!friendRequests || friendRequests.length === 0)
    return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    friendRequests,
    'Friend requests returned',
    friendRequests.length,
  );
}

async function newFriendRequest(req: ApiRequest, res: Response) {
  const friendRequests = await friendsService.getSentFriendRequests(req.userId);
  const activeRequests = friendRequests.map((request) => request.players.id);
  if (activeRequests.includes(req.params.friendId))
    return badRequest(
      req,
      res,
      'You have already sent a request to this player',
    );

  const friendRequest = await friendsService.addFriendRequest(
    req.userId,
    req.params.friendId,
  );
  if (req.params.friendId === req.userId)
    return badRequest(req, res, 'You cannot add yourself as a friend');

  return successfulResponse(req, res, friendRequest, 'Friend Request Added', 1);
}

async function acceptFriendRequest(req: ApiRequest, res: Response) {
  const { requestId } = req.params;
  if (!requestId) return badRequest(req, res, 'No requestId provided');

  const accepted = await friendsService.acceptFriendRequest(
    req.userId,
    requestId,
  );
  if (!accepted || !accepted?.requestId)
    return badRequest(req, res, 'Failed to accept friend request');

  return successfulResponse(req, res, accepted, 'Friend Request Accepted', 1);
}

async function declineFriendRequest(req: ApiRequest, res: Response) {
  const { requestId } = req.params;
  if (!requestId) return badRequest(req, res, 'No requestId provided');

  const declined = await friendsService.declineFriendRequest(
    req.userId,
    requestId,
  );

  if (!declined || !declined?.requestId)
    return badRequest(req, res, 'Failed to decline friend request');

  return successfulResponse(req, res, declined, 'Friend Request Declined', 1);
}

async function cancelFriendRequest(req: ApiRequest, res: Response) {
  const { requestId } = req.params;
  if (!requestId) return badRequest(req, res, 'No requestId provided');

  const cancelled = await friendsService.cancelFriendRequest(
    req.userId,
    requestId,
  );
  if (!cancelled || !cancelled?.requestId)
    return badRequest(req, res, 'Failed to decline friend request');

  return successfulResponse(req, res, cancelled, 'Friend Request Declined', 1);
}

async function removeFriend(req: ApiRequest, res: Response) {
  const { friendId } = req.params;
  if (!friendId) return badRequest(req, res, 'No friendId provided');

  const removed = await friendsService.removeFriend(req.userId, friendId);

  return successfulResponse(req, res, removed, 'Friend Removed', 1);
}

export default {
  getFriends,
  getFriendRequests,
  getSentFriendRequests,
  getRecievedFriendRequests,
  newFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
};
