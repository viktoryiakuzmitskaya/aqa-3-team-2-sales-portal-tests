import { test as base } from '@playwright/test';
import { HomePage } from 'ui/pages/home.page';
import { AssignManagerModal } from 'ui/pages/modals/assignManager.page';
import { ConfirmationModal } from 'ui/pages/modals/confirmationModal.page';
import { OrderDetailsHeader } from 'ui/pages/modals/orders/orderDetails.header';
import { SignInPage } from 'ui/pages/signIn.page';

interface ISalesPortalPages {
  homePage: HomePage;
  signInPage: SignInPage;
  assignManagerModal: AssignManagerModal;
  confirmationModal: ConfirmationModal;
  oredrDetalsHeader: OrderDetailsHeader;
}

export const test = base.extend<ISalesPortalPages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  assignManagerModal: async ({ page }, use) => {
    await use(new AssignManagerModal(page));
  },

  confirmationModal: async ({ page }, use) => {
    await use(new ConfirmationModal(page));
  },

  oredrDetalsHeader: async ({ page }, use) => {
    await use(new OrderDetailsHeader(page));
  },
});

export { expect } from '@playwright/test';
