import { test as base } from '@playwright/test';
import { HomePage } from 'ui/pages/home.page';
import { SignInPage } from 'ui/pages/signIn.page';
import { AssignManagerModal } from 'ui/pages/modals/assignManager.page';
import { ConfirmationModal } from 'ui/pages/modals/confirmationModal.page';
import { OrderDetailsHeader } from 'ui/pages/modals/orders/orderDetails.header';
import { OrderDetailsPage } from 'ui/pages/orders/orderDetailsPage.page';
import { HeaderPage } from 'ui/pages/header.page';
import { OrdersListPage } from 'ui/pages/orders/ordersList.page';

interface ISalesPortalPages {
  homePage: HomePage;
  signInPage: SignInPage;
  assignManagerModal: AssignManagerModal;
  confirmationModal: ConfirmationModal;
  orderDetailsHeader: OrderDetailsHeader;
  orderDetailsPage: OrderDetailsPage;
  headerPage: HeaderPage;
  orderListPage: OrdersListPage;
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

  orderDetailsHeader: async ({ page }, use) => {
    await use(new OrderDetailsHeader(page));
  },

  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },

  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  orderListPage: async ({ page }, use) => {
    await use(new OrdersListPage(page));
  },
});

export { expect } from '@playwright/test';
