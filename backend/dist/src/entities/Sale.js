"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = exports.SaleStatus = exports.FranchiseType = exports.ProductType = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const transformers_1 = require("../utils/transformers");
var ProductType;
(function (ProductType) {
    ProductType["CONSUMER_CREDIT"] = "Credito de Consumo";
    ProductType["PAYROLL_LOAN"] = "Libranza Libre Inversi\u00F3n";
    ProductType["CREDIT_CARD"] = "Tarjeta de Credito";
})(ProductType || (exports.ProductType = ProductType = {}));
var FranchiseType;
(function (FranchiseType) {
    FranchiseType["AMEX"] = "AMEX";
    FranchiseType["VISA"] = "VISA";
    FranchiseType["MASTERCARD"] = "MASTERCARD";
})(FranchiseType || (exports.FranchiseType = FranchiseType = {}));
var SaleStatus;
(function (SaleStatus) {
    SaleStatus["OPEN"] = "Abierto";
    SaleStatus["IN_PROGRESS"] = "En Proceso";
    SaleStatus["CLOSED"] = "Finalizado";
})(SaleStatus || (exports.SaleStatus = SaleStatus = {}));
let Sale = class Sale {
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ProductType }),
    __metadata("design:type", String)
], Sale.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: SaleStatus, default: SaleStatus.OPEN }),
    __metadata("design:type", String)
], Sale.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "requested_amount", type: "numeric", precision: 15, scale: 2, transformer: transformers_1.decimalTransformer }),
    __metadata("design:type", Number)
], Sale.prototype, "requestedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: FranchiseType, nullable: true }),
    __metadata("design:type", Object)
], Sale.prototype, "franchise", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rate", type: "numeric", precision: 5, scale: 2, nullable: true, transformer: transformers_1.decimalTransformer }),
    __metadata("design:type", Object)
], Sale.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.createdSales, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", User_1.User)
], Sale.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.updatedSales, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "updated_by" }),
    __metadata("design:type", Object)
], Sale.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Sale.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Sale.prototype, "updatedAt", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)({ name: "sales" })
], Sale);
//# sourceMappingURL=Sale.js.map