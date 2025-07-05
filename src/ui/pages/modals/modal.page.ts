import { expect, Locator } from '@playwright/test';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { logStep } from 'utils/reporter.utils';

export abstract class Modal extends SalesPortalPage {
  readonly cancelButton: Locator = this.page.locator('btn btn-secondary');
  readonly closeButton: Locator = this.page.locator('.modal-header .btn-close');

  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }

  @logStep('Click Close button in modal')
  async clickCloseButton() {
    await this.closeButton.click();
  }

  @logStep('Click Cancel button in modal')
  async clickCancelButton() {
    await this.cancelButton.click();
  }
}
