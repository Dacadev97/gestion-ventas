import "reflect-metadata";

import { DataSource } from "typeorm";

import { env } from "./config/env";
import { Role } from "./entities/Role";
import { Sale } from "./entities/Sale";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [Role, User, Sale],
  synchronize: true,
  logging: env.nodeEnv !== "production",
  connectTimeoutMS: 30000, // 30 segundos para conectar
  extra: {
    max: 10, // máximo de conexiones
    connectionTimeoutMillis: 30000,
  },
});
