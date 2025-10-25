"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_1 = require("./config/env");
const Role_1 = require("./entities/Role");
const Sale_1 = require("./entities/Sale");
const User_1 = require("./entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    username: env_1.env.db.username,
    password: env_1.env.db.password,
    database: env_1.env.db.database,
    entities: [Role_1.Role, User_1.User, Sale_1.Sale],
    synchronize: true,
    logging: env_1.env.nodeEnv !== "production",
    connectTimeoutMS: 30000,
    extra: {
        max: 10,
        connectionTimeoutMillis: 30000,
    },
});
//# sourceMappingURL=data-source.js.map