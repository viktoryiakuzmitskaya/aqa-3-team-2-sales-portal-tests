import { test as base } from '@playwright/test';
import { CustomersController } from '../api/controllers/customers.controller';
import { ProductsController } from '../api/controllers/products.controller';
import { SignInController } from '../api/controllers/signIn.controller';
import { NotificationsController } from 'api/controllers/notifications.controller';
import { OrdersController } from 'api/controllers/orders.controller';
import { HeaderPage } from '../ui/pages/header.page';
import { HomePage } from '../ui/pages/home.page';
import { SignInPage } from '../ui/pages/signIn.page';
import { AssignManagerModal } from '../ui/pages/modals/assignManager.page';
import { ConfirmationModal } from '../ui/pages/modals/confirmationModal.page';
import { OrderDetailsHeader } from '../ui/pages/modals/orders/orderDetails.header';
import { OrderDetailsPage } from '../ui/pages/orders/orderDetailsPage.page';
import { OrdersListPage } from '../ui/pages/orders/ordersList.page';
import { ManagersListPage } from '../ui/pages/managers/managersList.page';
import { CreateManagerPage } from '../ui/pages/managers/createManager.page';

interface IControllerFixtures {
  customerController: CustomersController;
  productController: ProductsController;
  signInController: SignInController;
  notificationController: NotificationsController;
  orderController: OrdersController;
  homePage: HomePage;
  signInPage: SignInPage;
  assignManagerModal: AssignManagerModal;
  confirmationModal: ConfirmationModal;
  orderDetailsHeader: OrderDetailsHeader;
  ordersListPage: OrdersListPage;
  headerPage: HeaderPage;
  orderDetailsPage: OrderDetailsPage;
  managersListPage: ManagersListPage;
  createManagerPage: CreateManagerPage;
}

export const test = base.extend<IControllerFixtures>({
  customerController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },

  productController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },

  signInController: async ({ request }, use) => {
    await use(new SignInController(request));
  },

  notificationController: async ({ request }, use) => {
    await use(new NotificationsController(request));
  },
  orderController: async ({ request }, use) => {
    await use(new OrdersController(request));
  },

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

  ordersListPage: async ({ page }, use) => {
    await use(new OrdersListPage(page));
  },

  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },

  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  managersListPage: async ({ page }, use) => {
    await use(new ManagersListPage(page));
  },

  createManagerPage: async ({ page }, use) => {
    await use(new CreateManagerPage(page));
  },
});

export { expect } from '@playwright/test';
