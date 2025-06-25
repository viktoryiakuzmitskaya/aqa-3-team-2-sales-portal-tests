import test from '@playwright/test';
import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { SignInPage } from 'ui/pages/signIn.page';

test.describe('[UI] [Sign In]', async () => {
  test('Should create customer with smoke data', async ({ page }) => {
    const signInPage = new SignInPage(page);

    await page.goto('https://anatoly-karpovich.github.io/aqa-course-project/#');
    await signInPage.fillCredentials({ email: USER_LOGIN, password: USER_PASSWORD });
    await signInPage.clickLogin();
  });
});
