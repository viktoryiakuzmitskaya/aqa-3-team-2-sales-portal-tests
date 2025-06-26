import { test } from '@playwright/test';
import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { SignInPage } from 'ui/pages/signIn.page';
import { HomePage } from 'ui/pages/home.page';
import { OrderDetailsPage } from 'ui/pages/orders/orderDetailsPage.page';

test.describe('[UI] [Tabs]', async () => {
  test('Should switch tabs', async ({ page }) => {
    const signInPage = new SignInPage(page);

    await page.goto('https://anatoly-karpovich.github.io/aqa-course-project/#');
    await signInPage.fillCredentials({ email: USER_LOGIN, password: USER_PASSWORD });
    await signInPage.clickLogin();

    const homePage = new HomePage(page);
    await homePage.waitForOpened();
    await page.goto(
      'https://anatoly-karpovich.github.io/aqa-course-project/#/orders/685c5f0d1c508c5d5e68355c',
    );

    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.clickOrderDetailsTab('Order History');
    // await orderDetailsPage.clickOrderDetailsTab('Delivery');
    // await orderDetailsPage.clickOrderDetailsTab('Comments');
  });
});
