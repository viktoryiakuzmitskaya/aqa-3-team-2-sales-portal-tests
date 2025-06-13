import { test as base } from '@playwright/test';
import { ProductsApiService } from '../../services/products.api-service';

interface IProductsApiService {
  productService: ProductsApiService;
}

export const test = base.extend<IProductsApiService>({
  productService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },
});

export { expect } from '@playwright/test';
