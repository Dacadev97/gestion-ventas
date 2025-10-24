"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const AppError_1 = require("../errors/AppError");
const UserService_1 = require("../services/UserService");
class UserController {
    constructor(userService = new UserService_1.UserService()) {
        this.userService = userService;
        this.list = async (_req, res) => {
            const users = await this.userService.list();
            res.json(users);
        };
        this.getById = async (req, res) => {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new AppError_1.AppError("Identificador inválido", 400);
            }
            const user = await this.userService.getById(id);
            res.json(user);
        };
        this.create = async (req, res) => {
            const { name, email, password, role } = req.body;
            const user = await this.userService.create({ name, email, password, role });
            res.status(201).json(user);
        };
        this.update = async (req, res) => {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new AppError_1.AppError("Identificador inválido", 400);
            }
            const { name, email, password, role } = req.body;
            const user = await this.userService.update(id, { name, email, password, role });
            res.json(user);
        };
        this.delete = async (req, res) => {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new AppError_1.AppError("Identificador inválido", 400);
            }
            await this.userService.delete(id);
            res.status(204).send();
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map