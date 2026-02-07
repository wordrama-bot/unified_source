// Node Modules
import express, { Request, Response } from 'express';

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../../middleware/auth';

// Schema
import {
  createCustomWordleBodyRequest
} from './customs.schema';

// Types
import { CreateCustomWordleBodyRequest } from './customs.types';

// Services
import {
  createCustom,
  deleteCustom,
  getCustomByShareCode,
  getCustoms
} from './customs.service';

const router = express.Router();

// GET - /api/v1/games/wordle/customs
router.get('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    // Get all customs shared with the user
    const customs = await getCustoms(req.userId, true);

    return res.status(customs.status).json(customs);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v1/games/wordle/customs/me
router.get('/me', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    // Get all customs created by the user
    const customs = await getCustoms(req.userId, false);

    return res.status(customs.status).json(customs);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v1/games/wordle/customs/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const custom = await getCustomByShareCode(id);

    return res.status(custom.status).json(custom);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// POST - /api/v1/games/wordle/customs
router.post('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const createCustomBody: CreateCustomWordleBodyRequest = await createCustomWordleBodyRequest
      .validateAsync(req.body);

    const custom = await createCustom(
      req.userId, 
      createCustomBody.isPublic,
      createCustomBody.shareToUserId,
      createCustomBody.customWord,
      createCustomBody.hint
    );

    return res.status(custom.status).json(custom);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// DELETE - /api/v1/games/wordle/customs/:id
router.delete('/:id', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const { id } = req.params;
    const custom = await deleteCustom(id, req.userId);

    return res.status(custom.status).json(custom);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
