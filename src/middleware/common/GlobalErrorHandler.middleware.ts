import { NextFunction, Request, Response } from "express";

export interface HttpError extends Error {
  status?: number;
}

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack || err.message || err);
  const status = typeof err.status === 'number' && err.status >= 400 ? err.status : 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};