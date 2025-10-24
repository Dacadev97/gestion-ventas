import { AppDataSource } from "../data-source";
import { env } from "../config/env";
import { Role, RoleName } from "../entities/Role";
import { User } from "../entities/User";
import { hashPassword } from "../utils/password";

export const seedInitialData = async () => {
  const roleRepository = AppDataSource.getRepository(Role);
  const userRepository = AppDataSource.getRepository(User);

  for (const roleName of Object.values(RoleName)) {
    const existing = await roleRepository.findOne({ where: { name: roleName } });

    if (!existing) {
      const role = roleRepository.create({ name: roleName });
      await roleRepository.save(role);
    }
  }

  const adminEmail = env.initialAdminEmail.toLowerCase();

  const adminUser = await userRepository.findOne({ where: { email: adminEmail } });

  if (!adminUser) {
    const adminRole = await roleRepository.findOne({ where: { name: RoleName.ADMIN } });

    if (!adminRole) {
      throw new Error("No se encontró el rol de administrador durante el seed");
    }

    const passwordHash = await hashPassword(env.initialAdminPassword);

    const user = userRepository.create({
      name: "Administrador",
      email: adminEmail,
      password: passwordHash,
      role: adminRole,
    });

    await userRepository.save(user);
  }
};
