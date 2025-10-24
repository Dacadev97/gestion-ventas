"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppError_1 = require("../errors/AppError");
const data_source_1 = require("../data-source");
const Role_1 = require("../entities/Role");
const User_1 = require("../entities/User");
const password_1 = require("../utils/password");
class UserService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        this.roleRepository = data_source_1.AppDataSource.getRepository(Role_1.Role);
    }
    list() {
        return this.userRepository.find({ order: { createdAt: "DESC" } });
    }
    async getById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new AppError_1.AppError("Usuario no encontrado", 404);
        }
        return user;
    }
    async getByIdWithRole(id) {
        const user = await this.userRepository.findOne({ where: { id }, relations: { role: true } });
        if (!user) {
            throw new AppError_1.AppError("Usuario no encontrado", 404);
        }
        return user;
    }
    async findByEmailWithPassword(email) {
        return this.userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .leftJoinAndSelect("user.role", "role")
            .where("user.email = :email", { email })
            .getOne();
    }
    async findRole(roleName) {
        const role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            throw new AppError_1.AppError("Rol no válido", 400);
        }
        return role;
    }
    async create(data) {
        const existing = await this.userRepository.findOne({ where: { email: data.email } });
        if (existing) {
            throw new AppError_1.AppError("El correo electrónico ya está registrado", 409);
        }
        const role = await this.findRole(data.role);
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        const user = this.userRepository.create({
            name: data.name,
            email: data.email,
            password: passwordHash,
            role,
        });
        const created = await this.userRepository.save(user);
        return this.getById(created.id);
    }
    async update(id, data) {
        const user = await this.getById(id);
        if (data.email && data.email !== user.email) {
            const existing = await this.userRepository.findOne({ where: { email: data.email } });
            if (existing) {
                throw new AppError_1.AppError("El correo electrónico ya está registrado", 409);
            }
        }
        if (data.name) {
            user.name = data.name;
        }
        if (data.email) {
            user.email = data.email;
        }
        if (data.role) {
            user.role = await this.findRole(data.role);
        }
        if (data.password) {
            user.password = await (0, password_1.hashPassword)(data.password);
        }
        await this.userRepository.save(user);
        return this.getById(user.id);
    }
    async delete(id) {
        const user = await this.getById(id);
        await this.userRepository.remove(user);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map