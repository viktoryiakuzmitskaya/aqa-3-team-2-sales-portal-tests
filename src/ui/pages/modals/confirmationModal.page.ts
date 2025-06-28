import { Locator } from '@playwright/test';
import { Modal } from 'ui/pages/modals/modal.page';
import { logStep } from 'utils/reporter.utils';
//this class can be used for modals: cancel modal,processing modal,reopen modal
export class ConfirmationModal extends Modal {
  readonly uniqueElement = this.page.locator('div.modal-dialog');
  readonly title: Locator = this.page.locator('div.modal-content .modal-title');
  readonly yesButton: Locator = this.page.locator('btn position-relative');
  readonly cancelButton: Locator = this.page.locator('btn btn-secondary');
  readonly closeButton: Locator = this.page.locator('.modal-header .btn-close');

  @logStep('Click Cancel button in modal')
  async clickCancelButton() {
    await this.cancelButton.click();
  }

  @logStep('Click Yes button in modal')
  async clickYesButton() {
    await this.yesButton.click();
  }

  @logStep('Click Close button in modal')
  async clickCloseButton() {
    await this.closeButton.click();
  }
}
