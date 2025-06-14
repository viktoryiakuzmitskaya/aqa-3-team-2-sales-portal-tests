import { test as base } from '@playwright/test';
import { SignInController } from 'api/controllers/signIn.controller';
import { USER_LOGIN, USER_PASSWORD } from 'config/environment';

export const test = base.extend<{ validToken: string }>({
  validToken: async ({ request }, use) => {
    const signInController = new SignInController(request);
    const loginResponse = await signInController.signIn({
      username: USER_LOGIN,
      password: USER_PASSWORD,
    });
    const validToken = (loginResponse.headers as Record<string, string>)['authorization'];
    await use(validToken);
  },
});
