import { ModuleName } from 'types/home.types';
import { SalesPortalPage } from './salesPortal.page';
import { Locator } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';

export class HomePage extends SalesPortalPage {
  title = this.page.locator('.welcome-text');
  customersButton = this.page.getByRole('link', { name: 'Customer' });
  productsButton = this.page.getByRole('link', { name: 'Products' });
  ordersButton = this.page.locator('#orders-from-home');
  managersButton = this.page.getByRole('link', { name: 'Managers' });
  // ordersButton = this.page.getByRole('link', { name: 'Orders', exact: true });

  uniqueElement = this.title;

  @logStep('Click on Module button')
  async clickModuleButton(moduleName: ModuleName) {
    const moduleButtons: Record<ModuleName, Locator> = {
      Customers: this.customersButton,
      Products: this.productsButton,
      Orders: this.ordersButton,
      Managers: this.managersButton,
    };

    await moduleButtons[moduleName].click();
  }
  @logStep('Open Home page via URL')
  async open() {
    await this.openPage('HOME');
    await this.waitForOpened();
  }
}
