import { SalesPortalPage } from '../salesPortal.page';
import { TabsList } from './tabs/tabsList.page';
import { DeliverTab } from './tabs/deliveryTab.page';

export class OrderDetailsPage extends SalesPortalPage {
  readonly title = this.page.locator('h2.ml-20');
  readonly orderDetailsNavigation = new TabsList(this.page);
  readonly deliveryTab = new DeliverTab(this.page);

  uniqueElement = this.title;
}
