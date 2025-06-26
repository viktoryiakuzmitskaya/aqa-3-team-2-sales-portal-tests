import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { logStep } from 'utils/reporter.utils';

export class TabsList extends SalesPortalPage {
  readonly list = this.page.locator('#order-details-tabs');
  readonly navigationItem = (name: string) =>
    this.list.locator('button.nav-link', { hasText: name });

  uniqueElement = this.list;

  async isNavigationItemSelected(name: string): Promise<boolean> {
    const isActive = await this.navigationItem(name).evaluate((el) =>
      el.classList.contains('active'),
    );
    return isActive;
  }

  @logStep('Click on order details tab')
  async clickOrderDetailsTab(name: string): Promise<void> {
    if (!(await this.isNavigationItemSelected(name))) {
      await this.navigationItem(name).click();
      await this.waitForOpened();
    }
  }
}
