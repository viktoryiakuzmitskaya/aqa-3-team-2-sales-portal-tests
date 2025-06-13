import { test as base } from '@playwright/test';
import { SignInController } from '../../api/controllers/signIn.controller';

interface ISignInController {
  signInController: SignInController;
}

export const test = base.extend<ISignInController>({
  signInController: async ({ request }, use) => {
    await use(new SignInController(request));
  },
});

export { expect } from '@playwright/test';
