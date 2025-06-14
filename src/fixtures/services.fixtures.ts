import { test as base } from '@playwright/test';
import { CustomersApiService } from '../services/customers.api-service';
import { ProductsApiService } from 'services/products.api-service';
import { SignInApiService } from 'services/signIn.api-service';

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
