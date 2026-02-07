import express from 'express';

import playerController from '../../controllers/player';
import friendsController from '../../controllers/friends';

export const router = express.Router();

/* Get routes */
router.get('/me', playerController.getPlayerProfile);
router.get('/friend-requests', friendsController.getFriendRequests);
router.get('/friend-requests/sent', friendsController.getSentFriendRequests);
router.get(
  '/friend-requests/recieved',
  friendsController.getRecievedFriendRequests,
);
router.get('/friends', friendsController.getFriends);

/* Post routes */
router.post(
  '/friend-requests/:friendId/add',
  friendsController.newFriendRequest,
);

/* Patch routes */
router.patch('/me', playerController.updatePlayer);
router.patch('/me/settings', playerController.updatePlayerSettings);
router.patch(
  '/friend-requests/:requestId/accept',
  friendsController.acceptFriendRequest,
);

/* Delete routes */
router.delete('/me', playerController.deletePlayer);
router.delete(
  '/friend-requests/:requestId/decline',
  friendsController.declineFriendRequest,
);
router.delete(
  '/friend-requests/:requestId/cancel',
  friendsController.cancelFriendRequest,
);
router.delete('/friends/:friendId/remove', friendsController.removeFriend);
