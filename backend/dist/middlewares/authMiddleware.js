"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const AppError_1 = require("../errors/AppError");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw new AppError_1.AppError("Token de autenticación requerido", 401);
    }
    const token = header.replace("Bearer ", "");
    const payload = (0, jwt_1.verifyAccessToken)(token);
    req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
    };
    next();
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, _res, next) => {
    const user = req.user;
    if (!user) {
        throw new AppError_1.AppError("No autorizado", 401);
    }
    if (!roles.includes(user.role)) {
        throw new AppError_1.AppError("No tienes permisos para realizar esta acción", 403);
    }
    next();
};
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map