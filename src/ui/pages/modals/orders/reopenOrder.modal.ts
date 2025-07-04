import { ConfirmationModal } from '../confirmationModal.page';
import { logStep } from 'utils/reporter.utils';

export class ReopenOrderModal extends ConfirmationModal {
  readonly uniqueElement = this.page.locator('.modal[name="confirmation-modal"]', {
    hasText: 'Reopen Order',
  });
  readonly modalDialog = this.uniqueElement.locator('.modal-dialog');
  readonly modalContent = this.modalDialog.locator('.modal-content');
  readonly modalHeader = this.modalContent.locator('.modal-header');
  readonly modalBody = this.modalContent.locator('.modal-body');
  readonly modalFooter = this.modalContent.locator('.modal-footer');

  // Body content
  readonly confirmationText = this.modalBody.locator('p');

  @logStep('Wait for reopen order modal to be visible')
  async waitForOpened() {
    await this.uniqueElement.waitFor({ state: 'visible' });
  }

  @logStep('Get confirmation text')
  async getConfirmationText(): Promise<string> {
    return (await this.confirmationText.textContent()) || '';
  }

  @logStep('Get modal title text')
  async getTitleText(): Promise<string> {
    return (await this.title.textContent()) || '';
  }

  @logStep('Confirm order reopen')
  async confirmReopen() {
    await this.clickYesButton();
    await this.waitForClosed();
  }

  @logStep('Cancel order reopen')
  async cancelReopen() {
    await this.clickCancelButton();
    await this.waitForClosed();
  }

  @logStep('Close modal using X button')
  async closeModal() {
    await this.clickCloseButton();
    await this.waitForClosed();
  }
}
