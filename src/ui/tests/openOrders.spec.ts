import { expect, Locator, Page, test } from '@playwright/test';
import { SignInPage } from '../pages/signIn.page';
import { HomePage } from '../pages/home.page';
import { HeaderPage } from '../pages/header.page';
import { ROUTES } from 'config/ui-config';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { TAGS } from 'data/tags';

class OrdersPage extends SalesPortalPage {
  readonly title: Locator = this.page.locator('#title > div.page-header-flex.ml-20 > h2');
  uniqueElement: Locator = this.title;

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.openPage('ORDERS');
    await this.waitForOpened();
  }
}

test.describe('Checking the opening of the Orders page', () => {
  let signInPage: SignInPage;
  let homePage: HomePage;
  let headerPage: HeaderPage;
  let ordersPage: OrdersPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
    homePage = new HomePage(page);
    headerPage = new HeaderPage(page);
    ordersPage = new OrdersPage(page);

    await page.goto('https://anatoly-karpovich.github.io/aqa-course-project/#');
    await signInPage.fillCredentials({ email: USER_LOGIN, password: USER_PASSWORD });
    await signInPage.clickLogin();
    await homePage.waitForOpened();
  });

  test(
    'Checking the opening of the Orders page by URL',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async ({ page }) => {
      await ordersPage.open();
      await ordersPage.waitForOpened();
      await expect(page).toHaveURL(ROUTES.ORDERS);

      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);
    },
  );

  test(
    'Checking if the Orders page can be accessed through the navigation menu',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async () => {
      await headerPage.clickModule('Orders');
      await ordersPage.waitForOpened();
      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);
    },
  );

  test(
    'Checking the highlighting of the active menu item when navigating directly to a URL',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async ({ page }) => {
      await page.goto(ROUTES.ORDERS);
      await ordersPage.waitForOpened();
      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);

      await expect(headerPage.moduleButtons['Customers']).not.toHaveClass(/active/);
      await expect(headerPage.moduleButtons['Products']).not.toHaveClass(/active/);
      await expect(headerPage.moduleButtons['Home']).not.toHaveClass(/active/);
    },
  );

  test(
    'Click on the Module button on the Home page',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async () => {
      await homePage.clickModuleButton('Orders');
      await ordersPage.waitForOpened();
      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);
    },
  );
});
