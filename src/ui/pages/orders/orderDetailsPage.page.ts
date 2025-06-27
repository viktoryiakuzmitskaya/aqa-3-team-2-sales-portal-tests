import { SalesPortalPage } from '../salesPortal.page';
import { DeliveryTab } from './tabs/deliveryTab.page';
import { logStep } from 'utils/reporter.utils';
import { OrderDetailsTab } from 'types/orderDetailsTabs.types';

export class OrderDetailsPage extends SalesPortalPage {
  readonly title = this.page.locator('h2.ml-20');
  readonly orderDetailsNavigation = this.page.locator('#order-details-tabs');
  readonly navigationItem = (name: OrderDetailsTab) =>
    this.orderDetailsNavigation.locator('button.nav-link', { hasText: name });
  readonly deliveryTab = new DeliveryTab(this.page);

  uniqueElement = this.title;

  @logStep('Click order details tab')
  async clickOrderDetailsTab(name: OrderDetailsTab): Promise<void> {
    const tab = this.navigationItem(name);
    if (await tab.evaluate((el) => !el.classList.contains('active'))) {
      await tab.click();
      await this.waitForOpened();
    }
  }
}
