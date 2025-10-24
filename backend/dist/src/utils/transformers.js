"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalTransformer = void 0;
exports.decimalTransformer = {
    to: (value) => (value ?? null),
    from: (value) => (value === null ? null : Number(value)),
};
//# sourceMappingURL=transformers.js.map