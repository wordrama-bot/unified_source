// Node Modules
import express, { Request, Response } from 'express';

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../middleware/auth';

// Services
import { 
  getNotifications,
  addNotification,
  dismissNotification
} from './notifications.service';
import { addNotificationBodySchema } from './notifications.schema';
import { AddNotificationBodyRequest } from './notifications.types';

const router = express.Router();

// GET - /api/v1/notifications
router.get('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const notifications = await getNotifications(req.userId);

    return res.status(notifications.status).json(notifications);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v1/notifications/:state
router.get('/:state', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const hasBeenRead = req.params.state === 'read' ? true : false;
    const notifications = await getNotifications(
      req.userId, 
      hasBeenRead
    );

    return res.status(notifications.status).json(notifications);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// ADD - /api/v1/notifications
router.post('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const {
      type,
      message
    }: AddNotificationBodyRequest = await addNotificationBodySchema
      .validateAsync(req.body);

    const notification = await addNotification(
      req.userId,
      type,
      message
    );

    return res.status(notification.status).json(notification);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// DELETE - /api/v1/notifications/:id
router.delete('/:id', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const deletedAccount = await dismissNotification(
      req.userId, 
      Number(req.params.id)
    );

    return res.status(deletedAccount.status).json(deletedAccount);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
