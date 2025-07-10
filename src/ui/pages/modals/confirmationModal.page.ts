import { Locator } from '@playwright/test';
import { Modal } from 'ui/pages/modals/modal.page';
import { logStep } from 'utils/reporter.utils';
//this class can be used for modals: cancel modal,processing modal,reopen modal
export class ConfirmationModal extends Modal {
  readonly modalContainer = this.page.locator('.modal-content');
  readonly uniqueElement = this.page.locator('div.modal-dialog');
  readonly title: Locator = this.page.locator('div.modal-content .modal-title');
  readonly yesButton = this.page.getByRole('button', { name: 'Yes, Cancel' });
  readonly confirmButton = this.modalContainer.locator('.modal-footer button[type="submit"]');

  @logStep('Click Yes button in modal')
  async clickYesButton() {
    await this.confirmButton.click();
  }
}
