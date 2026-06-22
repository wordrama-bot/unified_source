import { Request, Response } from 'express';
import service from '../services/accountDeletionFeedback';

async function create(req: Request, res: Response) {
  try {
    const { reason, comments } = req.body;

    const cleanReason =
      typeof reason === 'string' ? reason.trim().slice(0, 100) : null;

    const cleanComments =
      typeof comments === 'string' ? comments.trim().slice(0, 2000) : null;

    if (!cleanReason && !cleanComments) {
      return res.status(400).json({
        status: 400,
        message: 'Feedback reason or comments are required.',
      });
    }

    const feedback = await service.createFeedback(
      cleanReason,
      cleanComments,
    );

    return res.status(200).json({
      status: 200,
      data: feedback,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 500,
      message: 'Unable to save feedback.',
    });
  }
}

export default {
  create,
};
