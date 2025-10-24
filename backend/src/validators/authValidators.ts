import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .isString()
    .withMessage("El correo es requerido")
    .isLength({ max: 50 })
    .withMessage("El correo debe tener máximo 50 caracteres")
    .isEmail()
    .withMessage("Debe proporcionar un correo válido"),
  body("password")
    .isString()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6, max: 20 })
    .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
  body("captchaId")
    .isUUID()
    .withMessage("El captchaId debe ser un UUID válido"),
  body("captchaValue")
    .isString()
    .withMessage("El valor del captcha es requerido")
    .isLength({ min: 4, max: 6 })
    .withMessage("El captcha debe tener entre 4 y 6 caracteres"),
];
