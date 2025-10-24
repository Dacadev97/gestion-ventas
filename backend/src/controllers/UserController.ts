import { Request, Response } from "express";

import { RoleName } from "../entities/Role";
import { AppError } from "../errors/AppError";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  list = async (_req: Request, res: Response) => {
    const users = await this.userService.list();
    res.json(users);
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    const user = await this.userService.getById(id);
    res.json(user);
  };

  create = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: RoleName;
    };

    const user = await this.userService.create({ name, email, password, role });

    res.status(201).json(user);
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: RoleName;
    };

    const user = await this.userService.update(id, { name, email, password, role });

    res.json(user);
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    await this.userService.delete(id);

    res.status(204).send();
  };
}
