import { test as base } from '@playwright/test';
import { CustomersApiService } from '../api/services/customers.api-service';
import { ProductsApiService } from 'api/services/products.api-service';
import { SignInApiService } from 'api/services/signIn.api-service';

interface IServiceFixtures {
  customerService: CustomersApiService;
  productService: ProductsApiService;
  signInService: SignInApiService;
}

export const test = base.extend<IServiceFixtures>({
  customerService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },

  productService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },
  signInService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },
});

export { expect } from '@playwright/test';
