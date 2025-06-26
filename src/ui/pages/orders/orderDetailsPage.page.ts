import { SalesPortalPage } from '../salesPortal.page';
import { logStep } from 'utils/reporter.utils';

export class OrderDetailsPage extends SalesPortalPage {
  title = this.page.locator('h2.ml-20');
  orderDetailsNavigation = this.page.locator('#order-details-tabs');
  orderDetailsNavigationItem = (name: string) =>
    this.orderDetailsNavigation.locator('button.nav-link', { hasText: name });

  uniqueElement = this.title;

  @logStep('Click on order details tab')
  async clickOrderDetailsTab(name: string) {
    await this.orderDetailsNavigationItem(name).click();
    await this.waitForOpened();
  }
}
