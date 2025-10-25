import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error(err);

  const payload: Record<string, unknown> = { message: "Error interno del servidor" };
  if (env.nodeEnv !== "production") {
    payload.error = err.message;
  }

  return res.status(500).json(payload);
};
