"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const AppError_1 = require("../errors/AppError");
const Role_1 = require("../entities/Role");
const SaleService_1 = require("../services/SaleService");
const UserService_1 = require("../services/UserService");
class SaleController {
    constructor(saleService = new SaleService_1.SaleService(), userService = new UserService_1.UserService()) {
        this.saleService = saleService;
        this.userService = userService;
        this.list = async (req, res) => {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AppError("No autorizado", 401);
            }
            const { product, createdFrom, createdTo } = req.query;
            const filters = {
                product,
                createdFrom: createdFrom ? new Date(createdFrom) : undefined,
                createdTo: createdTo ? new Date(createdTo) : undefined,
                createdById: user.role === Role_1.RoleName.ADVISOR ? user.id : undefined,
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
        this.getById = async (req, res) => {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AppError("No autorizado", 401);
            }
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new AppError_1.AppError("Identificador inválido", 400);
            }
            const sale = await this.saleService.getById(id);
            if (user.role === Role_1.RoleName.ADVISOR && sale.createdBy.id !== user.id) {
                throw new AppError_1.AppError("No tienes permisos para ver esta venta", 403);
            }
            res.json(sale);
        };
        this.create = async (req, res) => {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AppError("No autorizado", 401);
            }
            const currentUser = await this.userService.getById(user.id);
            const { product, requestedAmount, franchise, rate } = req.body;
            const sale = await this.saleService.create({
                product,
                requestedAmount,
                franchise: franchise ?? null,
                rate: rate ?? null,
            }, currentUser);
            res.status(201).json(sale);
        };
        this.update = async (req, res) => {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AppError("No autorizado", 401);
            }
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new AppError_1.AppError("Identificador inválido", 400);
            }
            const currentUser = await this.userService.getById(user.id);
            const { product, requestedAmount, franchise, rate } = req.body;
            const sale = await this.saleService.update(id, {
                product,
                requestedAmount,
                franchise: franchise ?? null,
                rate: rate ?? null,
            }, currentUser);
            res.json(sale);
        };
        this.delete = async (req, res) => {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AppError("No autorizado", 401);
            }
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new AppError_1.AppError("Identificador inválido", 400);
            }
            const currentUser = await this.userService.getById(user.id);
            await this.saleService.delete(id, currentUser);
            res.status(204).send();
        };
    }
}
exports.SaleController = SaleController;
//# sourceMappingURL=SaleController.js.map