import { Repository, SelectQueryBuilder } from "typeorm";

import { AppDataSource } from "../data-source";
import { AppError } from "../errors/AppError";
import { FranchiseType, ProductType, Sale } from "../entities/Sale";
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
}

export class SaleService {
  private readonly saleRepository: Repository<Sale>;

  constructor() {
    this.saleRepository = AppDataSource.getRepository(Sale);
  }

  async list(filters: SaleFilters = {}): Promise<Sale[]> {
    const qb = this.applyFilters(this.baseQuery(), filters);

    return qb.getMany();
  }

  async getById(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: { createdBy: true, updatedBy: true },
    });

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

  private baseQuery(): SelectQueryBuilder<Sale> {
    return this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.createdBy", "createdBy")
      .leftJoinAndSelect("sale.updatedBy", "updatedBy")
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
}
