import { test as base } from '@playwright/test';
import { ProductsController } from '../../api/controllers/products.controller';

interface IProductsController {
  productController: ProductsController;
}

export const test = base.extend<IProductsController>({
  productController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },
});

export { expect } from '@playwright/test';
