import { AppDataSource } from '../src/data-source';
import { SaleService } from '../src/services/SaleService';
import { UserService } from '../src/services/UserService';
import { RoleName } from '../src/entities/Role';
import { ProductType } from '../src/entities/Sale';
import { seedInitialData } from '../src/bootstrap/seeds';

describe('SaleService', () => {
  let saleService: SaleService;
  let userService: UserService;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Seed roles necesarios para los tests
    await seedInitialData();
    
    saleService = new SaleService();
    userService = new UserService();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should create a sale', async () => {
    const user = await userService.create({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      role: RoleName.ADVISOR,
    });

    const sale = await saleService.create(
      {
        product: ProductType.CONSUMER_CREDIT,
        requestedAmount: 10000,
        rate: 5.5,
      },
      user,
    );

    expect(sale).toBeDefined();
    expect(sale.product).toBe(ProductType.CONSUMER_CREDIT);
    expect(sale.requestedAmount).toBe(10000);
  });

  it('should list sales', async () => {
    const sales = await saleService.list();
    expect(Array.isArray(sales)).toBe(true);
  });
});
