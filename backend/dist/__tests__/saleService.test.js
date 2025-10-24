"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../src/data-source");
const SaleService_1 = require("../src/services/SaleService");
const UserService_1 = require("../src/services/UserService");
const Role_1 = require("../src/entities/Role");
const Sale_1 = require("../src/entities/Sale");
describe('SaleService', () => {
    let saleService;
    let userService;
    beforeAll(async () => {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        saleService = new SaleService_1.SaleService();
        userService = new UserService_1.UserService();
    });
    afterAll(async () => {
        if (data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.destroy();
        }
    });
    it('should create a sale', async () => {
        const user = await userService.create({
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            password: 'password123',
            role: Role_1.RoleName.ADVISOR,
        });
        const sale = await saleService.create({
            product: Sale_1.ProductType.CONSUMER_CREDIT,
            requestedAmount: 10000,
            rate: 5.5,
        }, user);
        expect(sale).toBeDefined();
        expect(sale.product).toBe(Sale_1.ProductType.CONSUMER_CREDIT);
        expect(sale.requestedAmount).toBe(10000);
    });
    it('should list sales', async () => {
        const sales = await saleService.list();
        expect(Array.isArray(sales)).toBe(true);
    });
});
//# sourceMappingURL=saleService.test.js.map