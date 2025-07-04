import { test as base } from './pages.fixture';
import { HomeUIService } from 'ui/services/home.ui-service';
import { SignInUIService } from 'ui/services/signIn.ui-serivice';
import { OrdersUIService } from 'ui/services/orders.ui-service';

interface IUIServices {
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
  ordersUIService: OrdersUIService;
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
});

export { expect } from '@playwright/test';
