"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = require("../errors/AppError");
const validateRequest = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((error) => ({
            field: error.type === "field" ? error.path : undefined,
            message: error.msg,
        }));
        throw new AppError_1.AppError("Errores de validación", 422, extractedErrors);
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validationMiddleware.js.map