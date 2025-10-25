import { Repository, SelectQueryBuilder } from "typeorm";

import { AppDataSource } from "../data-source";
import { AppError } from "../errors/AppError";
import { FranchiseType, ProductType, Sale, SaleStatus } from "../entities/Sale";
import { RoleName } from "../entities/Role";
import { User } from "../entities/User";

interface SaleInput {
  product: ProductType;
  requestedAmount: number;
  franchise?: FranchiseType | null;
  rate?: number | null;
}

interface SaleFilters {
  product?: ProductType;
  createdFrom?: Date;
  createdTo?: Date;
  createdById?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export class SaleService {
  private readonly saleRepository: Repository<Sale>;

  constructor() {
    this.saleRepository = AppDataSource.getRepository(Sale);
  }

  async list(filters: SaleFilters = {}): Promise<Sale[]> {
    const qb = this.applyFilters(this.baseQuery(), filters);

    if (filters.sortBy) {
      const order = filters.sortOrder ?? "DESC";
      qb.orderBy(`sale.${filters.sortBy}`, order);
    }

    if (filters.page && filters.limit) {
      const skip = (filters.page - 1) * filters.limit;
      qb.skip(skip).take(filters.limit);
    }

    return qb.getMany();
  }

  async getById(id: number): Promise<Sale> {
    const sale = await this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.createdBy", "createdBy")
      .leftJoinAndSelect("createdBy.role", "createdByRole")
      .leftJoinAndSelect("sale.updatedBy", "updatedBy")
      .leftJoinAndSelect("updatedBy.role", "updatedByRole")
      .where("sale.id = :id", { id })
      .getOne();

    if (!sale) {
      throw new AppError("Venta no encontrada", 404);
    }

    return sale;
  }

  async create(data: SaleInput, user: User): Promise<Sale> {
    const sale = this.saleRepository.create({
      product: data.product,
      requestedAmount: data.requestedAmount,
      franchise: data.franchise ?? null,
      rate: data.rate ?? null,
      createdBy: user,
      updatedBy: user,
    });

    return this.saleRepository.save(sale);
  }

  async update(id: number, data: SaleInput, user: User): Promise<Sale> {
    const sale = await this.getById(id);

    this.ensureCanMutate(sale, user);

    sale.product = data.product;
    sale.requestedAmount = data.requestedAmount;
    sale.franchise = data.franchise ?? null;
    sale.rate = data.rate ?? null;
    sale.updatedBy = user;

    return this.saleRepository.save(sale);
  }

  async delete(id: number, user: User): Promise<void> {
    const sale = await this.getById(id);

    this.ensureCanMutate(sale, user);

    await this.saleRepository.remove(sale);
  }

  async updateStatus(id: number, status: SaleStatus, user: User): Promise<Sale> {
    const sale = await this.getById(id);

    this.ensureCanMutate(sale, user);

    sale.status = status;
    sale.updatedBy = user;

    return this.saleRepository.save(sale);
  }

  async totalRequested(filters: SaleFilters = {}): Promise<number> {
    const qb = this.applyFilters(
      this.saleRepository.createQueryBuilder("sale").leftJoin("sale.createdBy", "createdBy"),
      filters,
    );

    const result = await qb
      .select("COALESCE(SUM(sale.requested_amount), 0)", "total")
      .getRawOne<{ total: string }>();

    return Number(result?.total ?? 0);
  }

  async count(filters: SaleFilters = {}): Promise<number> {
    const qb = this.applyFilters(
      this.saleRepository.createQueryBuilder("sale").leftJoin("sale.createdBy", "createdBy"),
      filters,
    );

    return qb.getCount();
  }

  private baseQuery(): SelectQueryBuilder<Sale> {
    return this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.createdBy", "createdBy")
      .leftJoinAndSelect("createdBy.role", "createdByRole")
      .leftJoinAndSelect("sale.updatedBy", "updatedBy")
      .leftJoinAndSelect("updatedBy.role", "updatedByRole")
      .orderBy("sale.created_at", "DESC");
  }

  private applyFilters(qb: SelectQueryBuilder<Sale>, filters: SaleFilters): SelectQueryBuilder<Sale> {
    if (filters.product) {
      qb.andWhere("sale.product = :product", { product: filters.product });
    }

    if (filters.createdById) {
      qb.andWhere("createdBy.id = :createdById", { createdById: filters.createdById });
    }

    if (filters.createdFrom) {
      qb.andWhere("sale.created_at >= :createdFrom", { createdFrom: filters.createdFrom });
    }

    if (filters.createdTo) {
      qb.andWhere("sale.created_at <= :createdTo", { createdTo: filters.createdTo });
    }

    return qb;
  }

  private ensureCanMutate(sale: Sale, user: User): void {
    const roleName = user.role.name;

    if (roleName === RoleName.ADMIN) {
      return;
    }

    if (sale.createdBy.id !== user.id) {
      throw new AppError("No tienes permisos para modificar esta venta", 403);
    }
  }

  async statsByAdvisor(): Promise<{ advisorId: number; advisorName: string; count: number; total: number }[]> {
    const result = await this.saleRepository
      .createQueryBuilder("sale")
      .leftJoin("sale.createdBy", "createdBy")
      .select("createdBy.id", "advisorId")
      .addSelect("createdBy.name", "advisorName")
      .addSelect("COUNT(sale.id)", "count")
      .addSelect("COALESCE(SUM(sale.requested_amount), 0)", "total")
      .groupBy("createdBy.id")
      .addGroupBy("createdBy.name")
      .orderBy("count", "DESC")
      .getRawMany();

    return result.map((row) => ({
      advisorId: Number(row.advisorId),
      advisorName: String(row.advisorName),
      count: Number(row.count),
      total: Number(row.total),
    }));
  }

  async statsByProduct(): Promise<{ product: ProductType; count: number; total: number }[]> {
    const result = await this.saleRepository
      .createQueryBuilder("sale")
      .select("sale.product", "product")
      .addSelect("COUNT(sale.id)", "count")
      .addSelect("COALESCE(SUM(sale.requested_amount), 0)", "total")
      .groupBy("sale.product")
      .orderBy("total", "DESC")
      .getRawMany();

    return result.map((row) => ({
      product: row.product as ProductType,
      count: Number(row.count),
      total: Number(row.total),
    }));
  }

  async statsByDate(): Promise<{ date: string; count: number; total: number }[]> {
    const result = await this.saleRepository
      .createQueryBuilder("sale")
      .select("DATE(sale.created_at)", "date")
      .addSelect("COUNT(sale.id)", "count")
      .addSelect("COALESCE(SUM(sale.requested_amount), 0)", "total")
      .groupBy("DATE(sale.created_at)")
      .orderBy("date", "ASC")
      .getRawMany();

    return result.map((row) => ({
      date: String(row.date),
      count: Number(row.count),
      total: Number(row.total),
    }));
  }
}
