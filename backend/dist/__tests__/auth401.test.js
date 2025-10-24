"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
describe('Auth middleware', () => {
    it('GET /api/users without token should return 401', async () => {
        const res = await (0, supertest_1.default)(app_1.app).get('/api/users');
        expect(res.status).toBe(401);
        expect(res.body?.message).toBeDefined();
    });
});
//# sourceMappingURL=auth401.test.js.map