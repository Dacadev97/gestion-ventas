"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            details: err.details ?? null,
        });
    }
    console.error(err);
    return res.status(500).json({
        message: "Error interno del servidor",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map