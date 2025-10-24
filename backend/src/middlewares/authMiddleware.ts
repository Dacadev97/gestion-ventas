import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { RoleName } from "../entities/Role";
import { AuthTokenClaims, verifyAccessToken } from "../utils/jwt";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Token de autenticación requerido", 401);
  }

  const token = header.replace("Bearer ", "");
  const payload: AuthTokenClaims = verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };

  next();
};

export const authorize = (...roles: RoleName[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    if (!roles.includes(user.role)) {
      throw new AppError("No tienes permisos para realizar esta acción", 403);
    }

    next();
  };
