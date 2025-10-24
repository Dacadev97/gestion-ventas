"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidator = exports.createUserValidator = void 0;
const express_validator_1 = require("express-validator");
const Role_1 = require("../entities/Role");
const roleValues = Object.values(Role_1.RoleName);
exports.createUserValidator = [
    (0, express_validator_1.body)("name")
        .isString()
        .withMessage("El nombre es obligatorio")
        .isLength({ min: 1, max: 50 })
        .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
    (0, express_validator_1.body)("email")
        .isString()
        .withMessage("El correo es obligatorio")
        .isLength({ max: 50 })
        .withMessage("El correo debe tener máximo 50 caracteres")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido"),
    (0, express_validator_1.body)("password")
        .isString()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6, max: 20 })
        .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
    (0, express_validator_1.body)("role")
        .isIn(roleValues)
        .withMessage("El rol debe ser Administrador o Asesor"),
];
exports.updateUserValidator = [
    (0, express_validator_1.body)("name")
        .optional({ values: "falsy" })
        .isString()
        .withMessage("El nombre debe ser un texto")
        .isLength({ min: 1, max: 50 })
        .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
    (0, express_validator_1.body)("email")
        .optional({ values: "falsy" })
        .isString()
        .withMessage("El correo debe ser un texto")
        .isLength({ max: 50 })
        .withMessage("El correo debe tener máximo 50 caracteres")
        .isEmail()
        .withMessage("Debe proporcionar un correo válido"),
    (0, express_validator_1.body)("password")
        .optional({ values: "falsy" })
        .isString()
        .withMessage("La contraseña debe ser un texto")
        .isLength({ min: 6, max: 20 })
        .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
    (0, express_validator_1.body)("role")
        .optional({ values: "falsy" })
        .isIn(roleValues)
        .withMessage("El rol debe ser Administrador o Asesor"),
];
//# sourceMappingURL=userValidators.js.map