import { test as base } from '@playwright/test';
import { CustomersController } from '../api/controllers/customers.controller';
import { ProductsController } from '../api/controllers/products.controller';
import { SignInController } from '../api/controllers/signIn.controller';
import { NotificationsController } from 'api/controllers/notifications.controller';
import { OrdersController } from 'api/controllers/orders.controller';

interface IControllerFixtures {
  customerController: CustomersController;
  productController: ProductsController;
  signInController: SignInController;
  notificationController: NotificationsController;
  orderController: OrdersController;
}

export const test = base.extend<IControllerFixtures>({
  customerController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },

  productController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },

  signInController: async ({ request }, use) => {
    await use(new SignInController(request));
  },

  notificationController: async ({ request }, use) => {
    await use(new NotificationsController(request));
  },
  orderController: async ({ request }, use) => {
    await use(new OrdersController(request));
  },
});

export { expect } from '@playwright/test';
