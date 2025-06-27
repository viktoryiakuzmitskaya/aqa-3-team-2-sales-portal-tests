import { SalesPortalPage } from '../salesPortal.page';
import { DeliverTab } from './tabs/deliveryTab.page';
import { logStep } from 'utils/reporter.utils';
import { OrderDetalsTab } from 'types/orderDetailsTabs.types';

export class OrderDetailsPage extends SalesPortalPage {
  readonly title = this.page.locator('h2.ml-20');
  readonly orderDetailsNavigation = this.page.locator('#order-details-tabs');
  readonly navigationItem = (name: OrderDetalsTab) =>
    this.orderDetailsNavigation.locator('button.nav-link', { hasText: name });
  readonly deliveryTab = new DeliverTab(this.page);

  uniqueElement = this.title;

  @logStep('Click order details tab')
  async clickOrderDetailsTab(name: OrderDetalsTab): Promise<void> {
    const tab = this.navigationItem(name);
    const isActive = await tab.evaluate((el) => el.classList.contains('active'));
    if (!isActive) {
      await tab.click();
      await this.waitForOpened();
    }
  }
}
