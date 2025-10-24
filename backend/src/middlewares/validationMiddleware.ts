import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { AppError } from "../errors/AppError";

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : undefined,
      message: error.msg,
    }));

    throw new AppError("Errores de validación", 422, extractedErrors);
  }

  next();
};
