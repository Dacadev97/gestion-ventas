"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = void 0;
const data_source_1 = require("../data-source");
const env_1 = require("../config/env");
const Role_1 = require("../entities/Role");
const User_1 = require("../entities/User");
const password_1 = require("../utils/password");
const seedInitialData = async () => {
    const roleRepository = data_source_1.AppDataSource.getRepository(Role_1.Role);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    for (const roleName of Object.values(Role_1.RoleName)) {
        const existing = await roleRepository.findOne({ where: { name: roleName } });
        if (!existing) {
            const role = roleRepository.create({ name: roleName });
            await roleRepository.save(role);
        }
    }
    const adminEmail = env_1.env.initialAdminEmail.toLowerCase();
    const adminUser = await userRepository.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
        const adminRole = await roleRepository.findOne({ where: { name: Role_1.RoleName.ADMIN } });
        if (!adminRole) {
            throw new Error("No se encontró el rol de administrador durante el seed");
        }
        const passwordHash = await (0, password_1.hashPassword)(env_1.env.initialAdminPassword);
        const user = userRepository.create({
            name: "Administrador",
            email: adminEmail,
            password: passwordHash,
            role: adminRole,
        });
        await userRepository.save(user);
    }
};
exports.seedInitialData = seedInitialData;
//# sourceMappingURL=seeds.js.map