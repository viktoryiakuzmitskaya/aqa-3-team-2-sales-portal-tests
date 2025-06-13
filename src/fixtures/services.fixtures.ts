import { test as base } from '@playwright/test';
import { CustomersApiService } from '../services/customers.api-service';
import { ProductsApiService } from 'services/products.api-service';

interface IServiceFixtures {
  customerService: CustomersApiService;
  productService: ProductsApiService;
}

export const test = base.extend<IServiceFixtures>({
  customerService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },

  productService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },
});

export { expect } from '@playwright/test';
