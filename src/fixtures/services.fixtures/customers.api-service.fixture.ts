import { test as base } from '@playwright/test';
import { CustomersApiService } from '../../services/customers.api-service';

interface ICustomersApiService {
  customerService: CustomersApiService;
}

export const test = base.extend<ICustomersApiService>({
  customerService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },
});

export { expect } from '@playwright/test';
