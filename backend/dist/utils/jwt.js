"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = require("../errors/AppError");
const secret = env_1.env.jwtSecret;
const signOptions = { expiresIn: env_1.env.jwtExpiresIn };
const signAccessToken = (claims) => jsonwebtoken_1.default.sign(claims, secret, signOptions);
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    if (typeof decoded === "string" || typeof decoded !== "object" || decoded === null) {
        throw new AppError_1.AppError("Token inválido", 401);
    }
    const payload = decoded;
    const subValue = payload.sub;
    const emailValue = payload.email;
    const roleValue = payload.role;
    const id = typeof subValue === "string" ? Number(subValue) : subValue;
    if (typeof id !== "number" || Number.isNaN(id)) {
        throw new AppError_1.AppError("Token inválido", 401);
    }
    if (typeof emailValue !== "string" || typeof roleValue !== "string") {
        throw new AppError_1.AppError("Token inválido", 401);
    }
    return {
        sub: id,
        email: emailValue,
        role: roleValue,
    };
};
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=jwt.js.map