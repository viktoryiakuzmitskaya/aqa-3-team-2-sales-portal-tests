import { test as customerController } from 'fixtures/controllers.fixtures';
import { test as productController } from 'fixtures/controllers.fixtures';
import { test as signInController } from 'fixtures/controllers.fixtures';
import { test as customerService } from 'fixtures/services.fixtures';
import { test as productService } from 'fixtures/services.fixtures';
import { expect, mergeTests } from '@playwright/test';

const test = mergeTests(
  customerController,
  productController,
  signInController,
  customerService,
  productService,
);

export { expect, test };
