import { type Response } from 'express';
import { ApiRequest } from '../types';
import { db } from '../models';
import {
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

  return successfulResponse(
    req,
    res,
    Array.isArray(friends) ? friends : [],
    'Friends returned',
    Array.isArray(friends) ? friends.length : 0,
  );
}

async function getSentFriendRequests(req: ApiRequest, res: Response) {
  const friendRequests = await friendsService.getSentFriendRequests(req.userId);

  return successfulResponse(
    req,
    res,
    Array.isArray(friendRequests) ? friendRequests : [],
    'Friend sent requests returned',
    Array.isArray(friendRequests) ? friendRequests.length : 0,
  );
}

async function getRecievedFriendRequests(req: ApiRequest, res: Response) {
  const friendRequests = await friendsService.getRecievedFriendRequests(
    req.userId,
  );

  return successfulResponse(
    req,
    res,
    Array.isArray(friendRequests) ? friendRequests : [],
    'Friend recieved requests returned',
    Array.isArray(friendRequests) ? friendRequests.length : 0,
  );
}

async function getFriendRequests(req: ApiRequest, res: Response) {
  const validDirections = ['sent', 'received'];
  const { direction } = req.query;
  if (!direction || !validDirections.includes(direction as string))
    return badRequest(req, res, 'Invalid direction [sent, received]');

  const friendRequests = await friendsService.getFriendRequests(
    req.userId,
    direction as string,
  );

  return successfulResponse(
    req,
    res,
    Array.isArray(friendRequests) ? friendRequests : [],
    'Friend requests returned',
    Array.isArray(friendRequests) ? friendRequests.length : 0,
  );
}

async function newFriendRequest(req: ApiRequest, res: Response) {
  const validated = newFriendRequestSchema.safeParse(req.params);
  if (!validated.success) {
    return res.status(400).json({ status: 400, message: 'Invalid friend ID' });
  }
  const friendRequest = await friendsService.addFriendRequest(
    req.userId, validated.data.friendId,
  );
  if ('error' in friendRequest) {
    return res.status(400).json({ status: 400, message: friendRequest.error });
  }
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
    return badRequest(req, res, 'Failed to cancel friend request');

  return successfulResponse(req, res, cancelled, 'Friend Request Cancelled', 1);
}

async function removeFriend(req: ApiRequest, res: Response) {
  const { friendId } = req.params;
  if (!friendId) return badRequest(req, res, 'No friendId provided');

  const removed = await friendsService.removeFriend(req.userId, friendId);

  if (!removed?.id) return badRequest(req, res, 'Failed to remove friend');
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
