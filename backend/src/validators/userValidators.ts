import { body } from "express-validator";

import { RoleName } from "../entities/Role";

const roleValues = Object.values(RoleName);

export const createUserValidator = [
  body("name")
    .isString()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
  body("email")
    .isString()
    .withMessage("El correo es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El correo debe tener máximo 50 caracteres")
    .isEmail()
    .withMessage("Debe proporcionar un correo válido"),
  body("password")
    .isString()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6, max: 20 })
    .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
  body("role")
    .isIn(roleValues)
    .withMessage("El rol debe ser Administrador o Asesor"),
];

export const updateUserValidator = [
  body("name")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
  body("email")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("El correo debe ser un texto")
    .isLength({ max: 50 })
    .withMessage("El correo debe tener máximo 50 caracteres")
    .isEmail()
    .withMessage("Debe proporcionar un correo válido"),
  body("password")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .isLength({ min: 6, max: 20 })
    .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
  body("role")
    .optional({ values: "falsy" })
    .isIn(roleValues)
    .withMessage("El rol debe ser Administrador o Asesor"),
];
