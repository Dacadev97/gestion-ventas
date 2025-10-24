import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { RoleName } from "../entities/Role";
import { AppError } from "../errors/AppError";

export interface AuthTokenClaims {
  sub: number;
  email: string;
  role: RoleName;
}

const secret: Secret = env.jwtSecret;
const signOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };

export const signAccessToken = (claims: AuthTokenClaims): string =>
  jwt.sign(claims, secret, signOptions);

export const verifyAccessToken = (token: string): AuthTokenClaims => {
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === "string" || typeof decoded !== "object" || decoded === null) {
    throw new AppError("Token inválido", 401);
  }

  const payload = decoded as JwtPayload & { email?: unknown; role?: unknown };

  const subValue = payload.sub;
  const emailValue = payload.email;
  const roleValue = payload.role;

  const id = typeof subValue === "string" ? Number(subValue) : subValue;

  if (typeof id !== "number" || Number.isNaN(id)) {
    throw new AppError("Token inválido", 401);
  }

  if (typeof emailValue !== "string" || typeof roleValue !== "string") {
    throw new AppError("Token inválido", 401);
  }

  return {
    sub: id,
    email: emailValue,
    role: roleValue as RoleName,
  };
};
