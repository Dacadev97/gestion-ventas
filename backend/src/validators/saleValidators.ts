import { body, query } from "express-validator";

import { FranchiseType, ProductType } from "../entities/Sale";

const productValues = Object.values(ProductType);
const franchiseValues = Object.values(FranchiseType);

const franchiseValidation = body("franchise").custom((value, { req }) => {
  const product = req.body.product as ProductType | undefined;

  if (product === ProductType.CREDIT_CARD) {
    if (!value) {
      throw new Error("La franquicia es obligatoria para tarjetas de crédito");
    }

    if (!franchiseValues.includes(value)) {
      throw new Error("La franquicia debe ser AMEX, VISA o MASTERCARD");
    }
  } else if (value) {
    throw new Error("La franquicia solo se permite para tarjetas de crédito");
  }

  return true;
});

const rateValidation = body("rate").custom((value, { req }) => {
  const product = req.body.product as ProductType | undefined;
  const requiresRate =
    product === ProductType.CONSUMER_CREDIT || product === ProductType.PAYROLL_LOAN;

  if (requiresRate) {
    if (value === undefined || value === null || value === "") {
      throw new Error("La tasa es obligatoria para créditos y libranzas");
    }

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
      throw new Error("La tasa debe ser un número válido");
    }

    if (numeric < 0 || numeric > 99.99) {
      throw new Error("La tasa debe estar entre 0.00 y 99.99");
    }
  } else if (value !== undefined && value !== null && value !== "") {
    throw new Error("La tasa solo aplica para créditos o libranzas");
  }

  return true;
});

export const saleFiltersValidator = [
  query("product")
    .optional({ values: "falsy" })
    .isIn(productValues)
    .withMessage("El producto debe ser Crédito de Consumo, Libranza Libre Inversión o Tarjeta de Crédito"),
  query("createdFrom")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha inicial debe tener un formato válido")
    .toDate(),
  query("createdTo")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha final debe tener un formato válido")
    .toDate(),
];

const baseSaleBodyValidators = [
  body("product")
    .isIn(productValues)
    .withMessage("El producto debe ser Crédito de Consumo, Libranza Libre Inversión o Tarjeta de Crédito"),
  body("requestedAmount")
    .isNumeric({ no_symbols: false })
    .withMessage("El cupo solicitado debe ser un número válido")
    .custom((value) => Number(value) > 0)
    .withMessage("El cupo solicitado debe ser mayor a 0")
    .toFloat(),
  franchiseValidation,
  rateValidation,
];

export const createSaleValidator = baseSaleBodyValidators;

export const updateSaleValidator = baseSaleBodyValidators;
