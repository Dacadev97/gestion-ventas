"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleValidator = exports.createSaleValidator = exports.saleFiltersValidator = void 0;
const express_validator_1 = require("express-validator");
const Sale_1 = require("../entities/Sale");
const productValues = Object.values(Sale_1.ProductType);
const franchiseValues = Object.values(Sale_1.FranchiseType);
const franchiseValidation = (0, express_validator_1.body)("franchise").custom((value, { req }) => {
    const product = req.body.product;
    if (product === Sale_1.ProductType.CREDIT_CARD) {
        if (!value) {
            throw new Error("La franquicia es obligatoria para tarjetas de crédito");
        }
        if (!franchiseValues.includes(value)) {
            throw new Error("La franquicia debe ser AMEX, VISA o MASTERCARD");
        }
    }
    else if (value) {
        throw new Error("La franquicia solo se permite para tarjetas de crédito");
    }
    return true;
});
const rateValidation = (0, express_validator_1.body)("rate").custom((value, { req }) => {
    const product = req.body.product;
    const requiresRate = product === Sale_1.ProductType.CONSUMER_CREDIT || product === Sale_1.ProductType.PAYROLL_LOAN;
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
    }
    else if (value !== undefined && value !== null && value !== "") {
        throw new Error("La tasa solo aplica para créditos o libranzas");
    }
    return true;
});
exports.saleFiltersValidator = [
    (0, express_validator_1.query)("product")
        .optional({ values: "falsy" })
        .isIn(productValues)
        .withMessage("El producto debe ser Crédito de Consumo, Libranza Libre Inversión o Tarjeta de Crédito"),
    (0, express_validator_1.query)("createdFrom")
        .optional({ values: "falsy" })
        .isISO8601()
        .withMessage("La fecha inicial debe tener un formato válido")
        .toDate(),
    (0, express_validator_1.query)("createdTo")
        .optional({ values: "falsy" })
        .isISO8601()
        .withMessage("La fecha final debe tener un formato válido")
        .toDate(),
];
const baseSaleBodyValidators = [
    (0, express_validator_1.body)("product")
        .isIn(productValues)
        .withMessage("El producto debe ser Crédito de Consumo, Libranza Libre Inversión o Tarjeta de Crédito"),
    (0, express_validator_1.body)("requestedAmount")
        .isNumeric({ no_symbols: false })
        .withMessage("El cupo solicitado debe ser un número válido")
        .custom((value) => Number(value) > 0)
        .withMessage("El cupo solicitado debe ser mayor a 0")
        .toFloat(),
    franchiseValidation,
    rateValidation,
];
exports.createSaleValidator = baseSaleBodyValidators;
exports.updateSaleValidator = baseSaleBodyValidators;
//# sourceMappingURL=saleValidators.js.map