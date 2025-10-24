"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const numberFromEnv = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: numberFromEnv(process.env.PORT, 4000),
    jwtSecret: process.env.JWT_SECRET ?? "change-me",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    captchaTtlSeconds: numberFromEnv(process.env.CAPTCHA_TTL_SECONDS, 120),
    initialAdminEmail: process.env.INITIAL_ADMIN_EMAIL ?? "admin@konecta.local",
    initialAdminPassword: process.env.INITIAL_ADMIN_PASSWORD ?? "Konecta#2024",
    db: {
        host: process.env.DB_HOST ?? "localhost",
        port: numberFromEnv(process.env.DB_PORT, 5432),
        username: process.env.DB_USERNAME ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        database: process.env.DB_NAME ?? "konecta"
    }
};
//# sourceMappingURL=env.js.map