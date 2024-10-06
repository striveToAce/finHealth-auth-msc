import { validationResult } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(
      res,
      errors.array().map((_) => _.msg),
      errors.array().map((_) => _.msg)[0]
    );
  }
  next();
};
