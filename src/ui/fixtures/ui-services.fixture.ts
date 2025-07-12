import { test as base } from '@playwright/test';
import { HomeUIService } from 'ui/services/home.ui-service';
import { SignInUIService } from 'ui/services/signIn.ui-serivice';
import { OrdersUIService } from 'ui/services/orders.ui-service';
import { ManagersUIService } from 'ui/services/managers.ui-service';

interface IUIServices {
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
  ordersUIService: OrdersUIService;
  managersUIService: ManagersUIService;
}

export const test = base.extend<IUIServices>({
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
