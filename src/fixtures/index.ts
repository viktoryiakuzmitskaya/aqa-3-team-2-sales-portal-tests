import { test as customerController } from 'fixtures/controllers.fixtures/customer.controller.fixture';
import { test as productController } from 'fixtures/controllers.fixtures/product.controller.fixture';
import { test as signInController } from 'fixtures/controllers.fixtures/signIn.controller.fixture';
import { test as customerService } from 'fixtures/services.fixtures/customers.api-service.fixture';
import { test as productService } from 'fixtures/services.fixtures/products.api-service.fixture';
import { expect, mergeTests } from '@playwright/test';

const test = mergeTests(
  customerController,
  productController,
  signInController,
  customerService,
  productService,
);

export { expect, test };
