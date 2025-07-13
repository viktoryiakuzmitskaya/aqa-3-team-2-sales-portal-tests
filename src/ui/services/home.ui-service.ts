import { Page } from '@playwright/test';
import { HomePage } from 'ui/pages/home.page';
import { logStep } from 'utils/reporter.utils';
import { OrdersListPage } from 'ui/pages/orders/ordersList.page';
export class HomeUIService {
  homePage: HomePage;
  ordersListPage: OrdersListPage;
  constructor(private page: Page) {
    this.homePage = new HomePage(page);
    this.ordersListPage = new OrdersListPage(page);
  }

  @logStep('Open Sales Portal on Home Page')
  async openAsLoggedInUser() {
    await this.homePage.openPortal();
    await this.homePage.waitForOpened();
  }
  async openOrdersPage() {
    await this.homePage.clickModuleButton('Orders');
    await this.ordersListPage.waitForOpened();
  }
}
