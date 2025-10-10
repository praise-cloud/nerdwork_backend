import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";

export interface AuthRequest extends Request {
  user?: any; // decoded token payload — narrow this to your User type when available
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    res.status(500).json({ message: 'Authentication configuration error' });
    return;
  }

  const authHeader = (req.headers && req.headers.authorization) || '';
  if (!authHeader) {
    res.status(401).json({ message: "Missing authorization header" });
    return;
  }

  const parts = authHeader.split(' ');
  const token = parts.length === 1 ? parts[0] : parts.length >= 2 ? parts[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Malformed authorization header' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    return;
  } catch (err: any) {
    const message = err && err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ message });
    return;
  }
};
