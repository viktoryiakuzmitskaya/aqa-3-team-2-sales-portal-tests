import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SALES_PORTAL_URL } from 'config/environment';
import { ROUTES } from 'config/ui-config';
import { TIMEOUTS } from 'data/timeouts';

export abstract class SalesPortalPage extends BasePage {
  abstract uniqueElement: Locator;

  readonly spinner = this.page.locator('.spinner-border');
  readonly notification = this.page.locator('.toast-body');

  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible();
    await this.waitForSpinner();
  }

  async waitForSpinner() {
    await expect(this.spinner).toHaveCount(0, { timeout: TIMEOUTS.SEC_10 });
  }

  async waitForNotification(text: string) {
    await expect(this.notification.last()).toHaveText(text);
  }

  async openPortal() {
    this.page.goto(SALES_PORTAL_URL);
  }
  async openPage(page: keyof typeof ROUTES, id?: string) {
    const route = ROUTES[page];
    if (typeof route === 'string') {
      await this.page.goto(route);
    } else {
      if (!id) throw new Error('Id was not provided');
      await this.page.goto(route(id));
    }
  }
}
