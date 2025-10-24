"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleService = void 0;
const data_source_1 = require("../data-source");
const AppError_1 = require("../errors/AppError");
const Sale_1 = require("../entities/Sale");
const Role_1 = require("../entities/Role");
class SaleService {
    constructor() {
        this.saleRepository = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
    }
    async list(filters = {}) {
        const qb = this.applyFilters(this.baseQuery(), filters);
        return qb.getMany();
    }
    async getById(id) {
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: { createdBy: true, updatedBy: true },
        });
        if (!sale) {
            throw new AppError_1.AppError("Venta no encontrada", 404);
        }
        return sale;
    }
    async create(data, user) {
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
    async update(id, data, user) {
        const sale = await this.getById(id);
        this.ensureCanMutate(sale, user);
        sale.product = data.product;
        sale.requestedAmount = data.requestedAmount;
        sale.franchise = data.franchise ?? null;
        sale.rate = data.rate ?? null;
        sale.updatedBy = user;
        return this.saleRepository.save(sale);
    }
    async delete(id, user) {
        const sale = await this.getById(id);
        this.ensureCanMutate(sale, user);
        await this.saleRepository.remove(sale);
    }
    async totalRequested(filters = {}) {
        const qb = this.applyFilters(this.saleRepository.createQueryBuilder("sale").leftJoin("sale.createdBy", "createdBy"), filters);
        const result = await qb
            .select("COALESCE(SUM(sale.requested_amount), 0)", "total")
            .getRawOne();
        return Number(result?.total ?? 0);
    }
    baseQuery() {
        return this.saleRepository
            .createQueryBuilder("sale")
            .leftJoinAndSelect("sale.createdBy", "createdBy")
            .leftJoinAndSelect("sale.updatedBy", "updatedBy")
            .orderBy("sale.created_at", "DESC");
    }
    applyFilters(qb, filters) {
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
    ensureCanMutate(sale, user) {
        const roleName = user.role.name;
        if (roleName === Role_1.RoleName.ADMIN) {
            return;
        }
        if (sale.createdBy.id !== user.id) {
            throw new AppError_1.AppError("No tienes permisos para modificar esta venta", 403);
        }
    }
}
exports.SaleService = SaleService;
//# sourceMappingURL=SaleService.js.map