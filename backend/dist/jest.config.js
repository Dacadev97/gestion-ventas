"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    roots: ['<rootDir>'],
    clearMocks: true,
    verbose: true,
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map