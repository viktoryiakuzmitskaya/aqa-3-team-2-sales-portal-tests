import { test as base } from '@playwright/test';
import { CustomersApiService } from '../api/services/customers.api-service';
import { ProductsApiService } from '../api/services/products.api-service';
import { SignInApiService } from '../api/services/signIn.api-service';
import { NotificationsApiService } from '../api/services/notifications.api-service';
import { OrdersApiService } from '../api/services/orders.api-service';
import { HomeUIService } from '../ui/services/home.ui-service';
import { SignInUIService } from '../ui/services/signIn.ui-serivice';
import { OrdersUIService } from '../ui/services/orders.ui-service';
import { ManagersUIService } from '../ui/services/managers.ui-service';

interface IServiceFixtures {
  customerService: CustomersApiService;
  productService: ProductsApiService;
  signInService: SignInApiService;
  notificationService: NotificationsApiService;
  orderService: OrdersApiService;
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
  ordersUIService: OrdersUIService;
  managersUIService: ManagersUIService;
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

  notificationService: async ({ request }, use) => {
    await use(new NotificationsApiService(request));
  },

  orderService: async ({ request }, use) => {
    await use(new OrdersApiService(request));
  },

  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },

  signInUIService: async ({ page }, use) => {
    await use(new SignInUIService(page));
  },

  ordersUIService: async ({ page }, use) => {
    await use(new OrdersUIService(page));
  },

  managersUIService: async ({ page }, use) => {
    await use(new ManagersUIService(page));
  },
});

export { expect } from '@playwright/test';
