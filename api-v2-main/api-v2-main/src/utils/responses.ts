import { Response } from 'express';
import { ApiRequest } from '../types/index.js';

const baseResponse = {
  data: {},
  metadata: {},
  count: 0,
  message: '',
  status: 0,
};

export function notFoundResponse(req: ApiRequest, res: Response) {
  return res
    .status(404)
    .json({
      ...baseResponse,
      message: 'Not found',
      status: 404,
    })
    .end();
}

export function badRequest(req: ApiRequest, res: Response, message: string) {
  return res
    .status(404)
    .json({
      ...baseResponse,
      message: `Bad Request - ${message}`,
      status: 400,
    })
    .end();
}

export function unauthorizedResponse(req: ApiRequest, res: Response) {
  return res
    .status(401)
    .send({
      ...baseResponse,
      message: 'Unauthorized',
      status: 401,
    })
    .end();
}

export function successfulResponse(
  req: ApiRequest,
  res: Response,
  data: any,
  message: string,
  count: number,
  metadata?: any,
) {
  if (metadata)
    return res
      .status(200)
      .json({
        ...baseResponse,
        data,
        metadata,
        count,
        message,
        status: 200,
      })
      .end();
  return res
    .status(200)
    .json({
      ...baseResponse,
      data,
      count,
      message,
      status: 200,
    })
    .end();
}
