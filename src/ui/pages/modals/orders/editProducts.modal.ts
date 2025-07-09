import { logStep } from 'utils/reporter.utils';
import { Modal } from '../modal.page';

export class EditOrderProductsModal extends Modal {
  readonly modalBody = this.page.locator('#edit-products-modal');
  uniqueElement = this.modalBody;
  readonly modalContent = this.page.locator('.modal-content');
  readonly modalFooter = this.page.locator('.modal-footer');
  readonly addProductButton = this.page.locator('#add-product-btn');
  readonly saveButton = this.page.locator('#update-products-btn');
  readonly cancelButton = this.page.locator('#cancel-edit-products-modal-btn');
  readonly closeButton = this.page.locator('//button[@aria-label="Close"]');
  readonly productOrderInput = this.page.locator('select[name="Product"]');
  readonly orderProductContainer = this.page.locator('div[data-id]');
  readonly deleteButton = this.page.locator('button[title=Delete]');
  readonly totalPrice = this.page.locator('#total-price-order-modal');

  async updateLastAddedProduct(productName: string): Promise<void> {
    // 1. Получаем все элементы выпадающих списков продуктов
    const dropdowns = this.productOrderInput;
    // 2. Выбираем ПОСЛЕДНИЙ dropdown в списке
    const lastDropdown = dropdowns.last();
    await lastDropdown.waitFor();
    await lastDropdown.selectOption({ label: productName });
  }

  async deleteOrderProductByName(productName: string): Promise<void> {
    const lastContainer = this.orderProductContainer.filter({ hasText: productName }).last();

    await lastContainer.waitFor();
    await lastContainer.locator(this.deleteButton).click();
  }
  @logStep('Click on save button')
  async clickOnSaveButton() {
    await this.saveButton.click();
  }
  @logStep('Click on add new product button')
  async clickOnAddNewProductButton() {
    await this.addProductButton.click();
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
