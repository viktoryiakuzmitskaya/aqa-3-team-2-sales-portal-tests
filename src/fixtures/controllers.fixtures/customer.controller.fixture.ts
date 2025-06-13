import { test as base } from '@playwright/test';
import { CustomersController } from '../../api/controllers/customers.controller';

interface ICustomersController {
  customerController: CustomersController;
}

export const test = base.extend<ICustomersController>({
  customerController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },
});

export { expect } from '@playwright/test';
