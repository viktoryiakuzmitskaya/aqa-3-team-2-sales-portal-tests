import { Modal } from '../modal.page';
import { logStep } from 'utils/reporter.utils';
import {
  StatusFilterOption,
  AVAILABLE_STATUS_FILTERS,
  getCheckboxByStatus,
} from 'utils/checkbox.utils';

export class OrdersFiltersModal extends Modal {
  // Main modal elements
  readonly modalDialog = this.page.locator('.modal-dialog.modal-filters-wrapper');
  readonly modalContent = this.modalDialog.locator('.modal-content');
  readonly modalHeader = this.modalContent.locator('.modal-header');
  readonly modalBody = this.modalContent.locator('.modal-body.modal-filters-body');
  readonly modalFooter = this.modalContent.locator('.modal-footer');

  // Header elements
  readonly modalTitle = this.modalHeader.locator('.modal-title');

  // Filter checkboxes by status
  readonly draftCheckbox = this.modalBody.locator('#Draft-filter');
  readonly inProcessCheckbox = this.modalBody.locator('#In\\ Process-filter');
  readonly partiallyReceivedCheckbox = this.modalBody.locator('#Partially\\ Received-filter');
  readonly receivedCheckbox = this.modalBody.locator('#Received-filter');
  readonly canceledCheckbox = this.modalBody.locator('#Canceled-filter');

  // Footer buttons
  readonly applyButton = this.modalFooter.locator('#apply-filters');
  readonly clearFiltersButton = this.modalFooter.locator('#clear-filters');

  uniqueElement = this.modalContent;

  // Private getter for checkbox mappings
  private get checkboxMappings() {
    return {
      Draft: this.draftCheckbox,
      'In Process': this.inProcessCheckbox,
      'Partially Received': this.partiallyReceivedCheckbox,
      Received: this.receivedCheckbox,
      Canceled: this.canceledCheckbox,
    };
  }

  @logStep('Wait for filters modal to be visible')
  async waitForOpened() {
    await this.modalContent.waitFor({ state: 'visible' });
  }

  @logStep('Close filters modal using close button')
  async close() {
    await this.clickCloseButton();
    await this.modalContent.waitFor({ state: 'hidden' });
  }

  @logStep('Apply current filters')
  async applyFilters() {
    await this.applyButton.click();
    await this.waitForSpinner();
  }

  @logStep('Clear all filters')
  async clearAllFilters() {
    await this.clearFiltersButton.click();
    await this.waitForSpinner();
  }

  @logStep('Select filter by status: {status}')
  async selectStatusFilter(status: StatusFilterOption) {
    const checkbox = getCheckboxByStatus(this.checkboxMappings, status);
    if (checkbox) {
      await checkbox.check();
    }
  }

  @logStep('Unselect filter by status: {status}')
  async unselectStatusFilter(status: StatusFilterOption) {
    const checkbox = getCheckboxByStatus(this.checkboxMappings, status);
    if (checkbox) {
      await checkbox.uncheck();
    }
  }

  @logStep('Toggle filter by status: {status}')
  async toggleStatusFilter(status: StatusFilterOption) {
    const checkbox = getCheckboxByStatus(this.checkboxMappings, status);
    if (checkbox) {
      const isChecked = await checkbox.isChecked();
      if (isChecked) {
        await checkbox.uncheck();
      } else {
        await checkbox.check();
      }
    }
  }

  @logStep('Select multiple status filters: {statuses}')
  async selectMultipleStatusFilters(statuses: StatusFilterOption[]) {
    for (const status of statuses) {
      await this.selectStatusFilter(status);
    }
  }

  @logStep('Check if status filter is selected: {status}')
  async isStatusFilterSelected(status: StatusFilterOption): Promise<boolean> {
    const checkbox = getCheckboxByStatus(this.checkboxMappings, status);
    return checkbox ? await checkbox.isChecked() : false;
  }

  @logStep('Get all selected status filters')
  async getSelectedStatusFilters(): Promise<string[]> {
    const selectedStatuses: string[] = [];

    for (const status of AVAILABLE_STATUS_FILTERS) {
      if (await this.isStatusFilterSelected(status)) {
        selectedStatuses.push(status);
      }
    }

    return selectedStatuses;
  }

  @logStep('Unselect all status filters')
  async unselectAllStatusFilters() {
    for (const status of AVAILABLE_STATUS_FILTERS) {
      await this.unselectStatusFilter(status);
    }
  }

  @logStep('Apply filters and close modal')
  async applyFiltersAndClose() {
    await this.applyFilters();
    await this.modalContent.waitFor({ state: 'hidden' });
  }

  @logStep('Clear filters and close modal')
  async clearFiltersAndClose() {
    await this.clearAllFilters();
    await this.modalContent.waitFor({ state: 'hidden' });
  }
}
