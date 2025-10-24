import { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { FranchiseType, ProductType, SaleStatus } from "../entities/Sale";
import { RoleName } from "../entities/Role";
import { SaleService } from "../services/SaleService";
import { UserService } from "../services/UserService";

export class SaleController {
  constructor(
    private readonly saleService = new SaleService(),
    private readonly userService = new UserService(),
  ) {}

  list = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    const { product, createdFrom, createdTo } = req.query as {
      product?: ProductType;
      createdFrom?: string;
      createdTo?: string;
    };

    const filters = {
      product,
      createdFrom: createdFrom ? new Date(createdFrom) : undefined,
      createdTo: createdTo ? new Date(createdTo) : undefined,
      createdById: user.role === RoleName.ADVISOR ? user.id : undefined,
    };

    const [sales, total] = await Promise.all([
      this.saleService.list(filters),
      this.saleService.totalRequested(filters),
    ]);

    res.json({
      totalRequestedAmount: total,
      data: sales,
    });
  };

  getById = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    const sale = await this.saleService.getById(id);

    if (user.role === RoleName.ADVISOR && sale.createdBy.id !== user.id) {
      throw new AppError("No tienes permisos para ver esta venta", 403);
    }

    res.json(sale);
  };

  create = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    const currentUser = await this.userService.getById(user.id);

    const { product, requestedAmount, franchise, rate } = req.body as {
      product: ProductType;
      requestedAmount: number;
      franchise?: FranchiseType | null;
      rate?: number | null;
    };

    const sale = await this.saleService.create(
      {
        product,
        requestedAmount,
        franchise: franchise ?? null,
        rate: rate ?? null,
      },
      currentUser,
    );

    res.status(201).json(sale);
  };

  update = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    const currentUser = await this.userService.getById(user.id);

    const { product, requestedAmount, franchise, rate } = req.body as {
      product: ProductType;
      requestedAmount: number;
      franchise?: FranchiseType | null;
      rate?: number | null;
    };

    const sale = await this.saleService.update(
      id,
      {
        product,
        requestedAmount,
        franchise: franchise ?? null,
        rate: rate ?? null,
      },
      currentUser,
    );

    res.json(sale);
  };

  delete = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    const currentUser = await this.userService.getById(user.id);

    await this.saleService.delete(id, currentUser);

    res.status(204).send();
  };

  updateStatus = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Identificador inválido", 400);
    }

    const currentUser = await this.userService.getById(user.id);

    const { status } = req.body as { status: SaleStatus };

    const sale = await this.saleService.updateStatus(id, status, currentUser);

    res.json(sale);
  };
}
