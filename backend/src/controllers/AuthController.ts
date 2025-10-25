import { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { captchaService } from "../services";
import { UserService } from "../services/UserService";
import { comparePassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import { env } from "../config/env";

const mapUserResponse = (user: Awaited<ReturnType<UserService["getById"]>>) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class AuthController {
  constructor(private readonly userService = new UserService()) {}

  login = async (req: Request, res: Response) => {
    const { email, password, captchaId, captchaValue } = req.body as {
      email: string;
      password: string;
      captchaId: string;
      captchaValue: string;
    };

    const captchaValid = captchaService.validate(captchaId, captchaValue);

    if (!captchaValid) {
      throw new AppError("Captcha inválido", 400);
    }

    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    const responseUser = await this.userService.getById(user.id);

    return res.json({
      token,
      user: mapUserResponse(responseUser),
    });
  };

  me = async (req: Request, res: Response) => {
    const authUser = req.user;

    if (!authUser) {
      throw new AppError("No autorizado", 401);
    }

    const user = await this.userService.getById(authUser.id);
    return res.json(mapUserResponse(user));
  };

  // Endpoint de utilidad solo en desarrollo para obtener un token sin captcha
  devToken = async (req: Request, res: Response) => {
    if (env.nodeEnv === "production") {
      throw new AppError("No autorizado", 401);
    }

    const { sub, email, role } = req.query as {
      sub?: string;
      email?: string;
      role?: string;
    };

    const id = sub ? Number(sub) : 1;
    const mail = email ?? env.initialAdminEmail;
    const roleName = (role ?? "Administrador") as any;

    const token = signAccessToken({ sub: id, email: mail, role: roleName });

    res.json({ token });
  };
}
