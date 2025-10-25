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

    const { product, createdFrom, createdTo, page, limit, sortBy, sortOrder } = req.query as {
      product?: ProductType;
      createdFrom?: string;
      createdTo?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: "ASC" | "DESC";
    };

    const toEndOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    const filters = {
      product,
      createdFrom: createdFrom ? new Date(createdFrom) : undefined,
      createdTo: createdTo ? toEndOfDay(new Date(createdTo)) : undefined,
      // Requisito: asesores deben poder ver todas las ventas, no filtrar por autor
      createdById: undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
    };

    const [sales, total, count] = await Promise.all([
      this.saleService.list(filters),
      this.saleService.totalRequested(filters),
      this.saleService.count(filters),
    ]);

    res.json({
      totalRequestedAmount: total,
      data: sales,
      count,
      page: filters.page,
      limit: filters.limit,
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

    // Requisito: asesores pueden ver cualquier venta (pero no necesariamente editar)

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

  stats = async (_req: Request, res: Response) => {
    const [salesByAdvisor, amountByProduct, salesByDate] = await Promise.all([
      this.saleService.statsByAdvisor(),
      this.saleService.statsByProduct(),
      this.saleService.statsByDate(),
    ]);

    res.json({
      salesByAdvisor,
      amountByProduct,
      salesByDate,
    });
  };
}
