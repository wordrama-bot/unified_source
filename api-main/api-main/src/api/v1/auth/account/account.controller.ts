// Node Modules
import express, { Request, Response } from 'express';

// Schema
import { 
  updateProfileBodySchema,
  updateUsernameBodySchema,
  linkDiscordBodySchema
} from './account.schema';
// Types
import { 
  UpdateProfileBodyRequest,
  UpdateUsernameBodyRequest,
  LinkDiscordBodyRequest
} from './account.types';
// Services
import { 
  getPublicProfile,
  updateProfile,
  updateSetupStepperState,
  deleteAccount,
  updateUsername,
  linkDiscord,
  unlinkDiscord
} from './account.service';

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../middleware/auth';

const router = express.Router();

// GET - /api/v1/auth/account/:userId
router.get('/public/:userId', async (req: Request, res: Response) => {
  try {
    const profile = await getPublicProfile(req.params.userId);

    return res.status(profile.status).json(profile);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// UPDATE - /api/v1/auth/account
router.post('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const {
      firstname,
      lastname,
      profileImage
    }: UpdateProfileBodyRequest = await updateProfileBodySchema
      .validateAsync(req.body);

    const updatedAccount = await updateProfile(
      req.userId, 
      firstname,
      lastname,
      profileImage
    );

    return res.status(updatedAccount.status).json(updatedAccount);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// UPDATE - /api/v1/auth/account/setup-complete
router.post('/setup-complete', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const updatedAccount = await updateSetupStepperState(req.userId);

    return res.status(updatedAccount.status).json(updatedAccount);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// UPDATE - /api/v1/auth/account/username
router.post('/username', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const {
      username
    }: UpdateUsernameBodyRequest = await updateUsernameBodySchema
      .validateAsync(req.body);

    const updatedAccount = await updateUsername(
      req.userId, 
      username
    );

    return res.status(updatedAccount.status).json(updatedAccount);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// UPDATE - /api/v1/auth/account/discord/link
router.post('/discord/link', async (req: Request, res: Response) => {
  try {
    const {
      linkCode,
      discordUsername,
      discordUserId
    }: LinkDiscordBodyRequest = await linkDiscordBodySchema
      .validateAsync(req.body);

    const updatedAccount = await linkDiscord(
      linkCode,
      discordUsername,
      discordUserId
    );

    return res.status(updatedAccount.status).json(updatedAccount);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// DELETE - /api/v1/auth/account
router.delete('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const deletedAccount = await deleteAccount(req.userId);

    return res.status(deletedAccount.status).json(deletedAccount);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// DELETE - /api/v1/auth/account/discord/link
router.delete('/discord/link', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const deletedAccount = await unlinkDiscord(req.userId);

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
