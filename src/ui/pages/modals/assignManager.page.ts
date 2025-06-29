import { Locator } from '@playwright/test';
import { Modal } from 'ui/pages/modals/modal.page';
import { logStep } from 'utils/reporter.utils';

export class AssignManagerModal extends Modal {
  readonly uniqueElement = this.page.locator('#assign-manager-modal');
  readonly title: Locator = this.uniqueElement.locator('div.modal-dialog .modal-title');
  readonly saveButton: Locator = this.uniqueElement.locator('div.modal-dialog #update-manager-btn');
  readonly cancelButton: Locator = this.uniqueElement.locator(
    'div.modal-dialog #cancel-edit-manager-modal-btn',
  );
  readonly closeButton: Locator = this.uniqueElement.locator(
    'div.modal-dialog .modal-header .btn-close',
  );
  readonly managerInList = this.uniqueElement.locator('#manager-list li');
  readonly managerByUserName = (username: string) =>
    this.managerInList.filter({ has: this.page.getByText(`(${username})`) });
  readonly searchManagerInput = this.uniqueElement.locator('manager-search-input');

  @logStep('Click Cancel button in Assign Manager modal')
  async clickCancelButton() {
    await this.cancelButton.click();
  }

  @logStep('Click Save button in Assign Manager modal')
  async clickSaveButton() {
    await this.saveButton.click();
  }

  @logStep('Click Close button in Assign Manager modal')
  async clickCloseButton() {
    await this.closeButton.click();
  }

  @logStep('Select manager in Assign Manager modal')
  async selectManager(username: string) {
    await this.managerByUserName(username).click();
  }

  @logStep('Click Save button in Assign Manager modal')
  async typeSearch(value: string) {
    await this.searchManagerInput.fill(value);
  }
}
