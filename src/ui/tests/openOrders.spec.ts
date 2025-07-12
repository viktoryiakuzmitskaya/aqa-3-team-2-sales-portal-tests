import { ROUTES } from 'config/ui-config';
import { expect, test } from 'fixtures/index';
import { TAGS } from 'data/tags';

test.describe('Checking the opening of the Orders page', () => {
  test.beforeEach(async ({ signInUIService }) => {
    await signInUIService.signInAsLocalUser();
  });

  test(
    'Checking the opening of the Orders page by URL',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async ({ page, ordersUIService, headerPage }) => {
      await ordersUIService.openOrdersList();
      await ordersUIService.verifyOrdersListLoaded();
      await expect(page).toHaveURL(ROUTES.ORDERS);

      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);
    },
  );

  test(
    'Checking if the Orders page can be accessed through the navigation menu',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async ({ headerPage }) => {
      await headerPage.clickModule('Orders');
      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);
    },
  );

  test(
    'Checking the highlighting of the active menu item when navigating directly to a URL',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async ({ page, ordersUIService, headerPage }) => {
      await page.goto(ROUTES.ORDERS);
      await ordersUIService.verifyOrdersListLoaded();
      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);

      await expect(headerPage.moduleButtons['Customers']).not.toHaveClass(/active/);
      await expect(headerPage.moduleButtons['Products']).not.toHaveClass(/active/);
      await expect(headerPage.moduleButtons['Home']).not.toHaveClass(/active/);
    },
  );

  test(
    'Click on the Module button on the Home page',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
    async ({ homePage, headerPage }) => {
      await homePage.clickModuleButton('Orders');
      await expect(headerPage.moduleButtons['Orders']).toHaveClass(/active/);
    },
  );
});
