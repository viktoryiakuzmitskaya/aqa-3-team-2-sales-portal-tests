import { logStep } from 'utils/reporter.utils';
import { Modal } from '../modal.page';

export class EditOrderCustomerModal extends Modal {
  readonly modalBody = this.page.locator('#edit-customer-modal');
  uniqueElement = this.modalBody;
  readonly modalContent = this.page.locator('.modal-content');
  readonly modalFooter = this.page.locator('.modal-footer');
  readonly inputCustomer = this.page.locator('#inputCustomerOrder');
  readonly saveButton = this.page.locator('#update-customer-btn');
  readonly cancelButton = this.page.locator('#cancel-edit-customer-modal-btn');
  readonly closeButton = this.page.locator('#cancel-edit-customer-modal-btn');

  async selectCustomerByName(newCustomerName: string): Promise<void> {
    const dropdowns = this.inputCustomer;
    await dropdowns.selectOption({ value: newCustomerName });
  }
  @logStep('Click on save button')
  async clickOnSaveButton() {
    await this.saveButton.click();
  }
  @logStep('Click on cancel button')
  async clickOnCancelButton() {
    await this.cancelButton.click();
  }
  @logStep('Click on close button')
  async clickOnCloseButton() {
    await this.closeButton.click();
  }
}
