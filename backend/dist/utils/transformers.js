"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleTransformer = exports.decimalTransformer = void 0;
exports.decimalTransformer = {
    to: (value) => (value ?? null),
    from: (value) => (value === null ? null : Number(value)),
};
exports.roleTransformer = {
    to: (value) => value,
    from: (value) => (value ? value.name : null),
};
//# sourceMappingURL=transformers.js.map