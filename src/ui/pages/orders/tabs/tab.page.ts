import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { Locator } from '@playwright/test';

export abstract class Tab extends SalesPortalPage {
  abstract get uniqueElement(): Locator;

  get title() {
    return this.uniqueElement.locator('h4.ms-3');
  }

  async isTabOpened(): Promise<boolean> {
    const isActive = await this.uniqueElement.evaluate((el) => el.classList.contains('active'));
    return isActive;
  }

  async getTabTitle(): Promise<string> {
    return (await this.title.textContent()) || '';
  }
}
