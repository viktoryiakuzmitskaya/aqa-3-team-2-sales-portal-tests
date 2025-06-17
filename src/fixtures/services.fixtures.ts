import { test as base } from '@playwright/test';
import { CustomersApiService } from '../api/services/customers.api-service';
import { ProductsApiService } from 'api/services/products.api-service';
import { SignInApiService } from 'api/services/signIn.api-service';

interface IServiceFixtures {
  customerService: CustomersApiService;
  productService: ProductsApiService;
  signInService: SignInApiService;
  product: IProductFromResponse;
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
  product: async ({ productService, signInService }, use) => {
    const token = await signInService.loginAsLocalUser();
    const product = await productService.create(token);
    await use(product);
    try {
      await productService.controller.delete(product._id, token);
    } catch (error) {
      console.error(`Failed to delete product ${product._id}:`, error);
    }
  },
});

export { expect } from '@playwright/test';
