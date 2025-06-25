import { test as base } from './pages.fixture';
import { HomeUIService } from 'ui/services/home.ui-service';
import { SignInUIService } from 'ui/services/signIn.ui-serivice';

interface IUIServices {
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
}

export const test = base.extend<IUIServices>({
  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },
  signInUIService: async ({ page }, use) => {
    await use(new SignInUIService(page));
  },
});

export { expect } from '@playwright/test';
