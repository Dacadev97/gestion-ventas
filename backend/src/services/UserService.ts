import { Repository } from "typeorm";

import { AppError } from "../errors/AppError";
import { AppDataSource } from "../data-source";
import { Role, RoleName } from "../entities/Role";
import { User } from "../entities/User";
import { hashPassword } from "../utils/password";

interface UserInput {
  name: string;
  email: string;
  password: string;
  role: RoleName;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: RoleName;
}

export class UserService {
  private readonly userRepository: Repository<User>;

  private readonly roleRepository: Repository<Role>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  list(): Promise<User[]> {
    return this.userRepository.find({ order: { createdAt: "DESC" } });
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  }

  async getByIdWithRole(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: { role: true } });

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.role", "role")
      .where("user.email = :email", { email })
      .getOne();
  }

  private async findRole(roleName: RoleName): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new AppError("Rol no válido", 400);
    }

    return role;
  }

  async create(data: UserInput): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: data.email } });

    if (existing) {
      throw new AppError("El correo electrónico ya está registrado", 409);
    }

    const role = await this.findRole(data.role);
    const passwordHash = await hashPassword(data.password);

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role,
    });

    const created = await this.userRepository.save(user);

    return this.getById(created.id);
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const user = await this.getById(id);

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findOne({ where: { email: data.email } });

      if (existing) {
        throw new AppError("El correo electrónico ya está registrado", 409);
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
      user.password = await hashPassword(data.password);
    }

    await this.userRepository.save(user);

    return this.getById(user.id);
  }

  async delete(id: number): Promise<void> {
    const user = await this.getById(id);

    await this.userRepository.remove(user);
  }
}
