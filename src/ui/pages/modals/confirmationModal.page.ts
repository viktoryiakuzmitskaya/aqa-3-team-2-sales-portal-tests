import { Locator } from '@playwright/test';
import { Modal } from 'ui/pages/modals/modal.page';
import { logStep } from 'utils/reporter.utils';
//this class can be used for modals: cancel modal,processing modal,reopen modal
export class ConfirmationModal extends Modal {
  readonly uniqueElement = this.page.locator('div.modal-dialog');
  readonly title: Locator = this.page.locator('div.modal-content .modal-title');
  readonly yesButton: Locator = this.page.locator('btn position-relative');

  @logStep('Click Yes button in modal')
  async clickYesButton() {
    await this.yesButton.click();
  }
}
