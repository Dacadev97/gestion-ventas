"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .isString()
        .withMessage("El correo es requerido")
        .isLength({ max: 50 })
        .withMessage("El correo debe tener máximo 50 caracteres")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido"),
    (0, express_validator_1.body)("password")
        .isString()
        .withMessage("La contraseña es requerida")
        .isLength({ min: 6, max: 20 })
        .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
    (0, express_validator_1.body)("captchaId")
        .isUUID()
        .withMessage("El captchaId debe ser un UUID válido"),
    (0, express_validator_1.body)("captchaValue")
        .isString()
        .withMessage("El valor del captcha es requerido")
        .isLength({ min: 4, max: 6 })
        .withMessage("El captcha debe tener entre 4 y 6 caracteres"),
];
//# sourceMappingURL=authValidators.js.map