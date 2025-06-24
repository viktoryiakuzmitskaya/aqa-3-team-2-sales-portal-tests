import { test as base } from '@playwright/test';
import { HomePage } from 'ui/pages/home.page';
import { SideMenuComponent } from 'ui/pages/sideMenu.page';
import { SignInPage } from 'ui/pages/signIn.page';

interface ISalesPortalPages {
  homePage: HomePage;
  signInPage: SignInPage;
  sideMenu: SideMenuComponent;
}

export const test = base.extend<ISalesPortalPages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  sideMenu: async ({ page }, use) => {
    await use(new SideMenuComponent(page));
  },
});

export { expect } from '@playwright/test';
