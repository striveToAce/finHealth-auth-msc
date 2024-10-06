import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseHandler } from '../utils/responseHandler';


interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return ResponseHandler.error(res,{},'Unauthorized',401);

  try {
    const decoded = jwt.verify(token || "", process.env.JWT_SECRET!);
    req.user = decoded
    next();
  } catch (error) {
    return ResponseHandler.error(res,error,'Invalid token',401);
  }
};