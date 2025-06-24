import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SALES_PORTAL_URL } from 'config/environment';

export abstract class SalesPortalPage extends BasePage {
  abstract uniqueElement: Locator;

  readonly spinner = this.page.locator('.spinner-border');
  readonly notification = this.page.locator('.toast-body');

  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible();
    await this.waitForSpinner();
  }

  async waitForSpinner() {
    await expect(this.spinner).toHaveCount(0);
  }

  async waitForNotification(text: string) {
    await expect(this.notification.last()).toHaveText(text);
  }

  async openPortal() {
    this.page.goto(SALES_PORTAL_URL);
  }
}
