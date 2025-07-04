import { Modal } from '../modal.page';
import { logStep } from 'utils/reporter.utils';
import { selectDropdownOption, getDropdownOptions } from 'utils/dropdown.utils';

export class CreateOrderModal extends Modal {
  readonly uniqueElement = this.page.locator('#add-order-modal');
  readonly modalDialog = this.uniqueElement.locator('.modal-dialog');
  readonly modalContent = this.modalDialog.locator('.modal-content');
  readonly modalHeader = this.modalContent.locator('.modal-header');
  readonly modalBody = this.modalContent.locator('.modal-body#add-order-modal-body');
  readonly modalFooter = this.modalContent.locator('.modal-footer');

  // Header elements
  readonly title = this.modalHeader.locator('.modal-title');

  // Form elements
  readonly form = this.modalBody.locator('#create-order-form');
  readonly customerSelect = this.modalBody.locator('#inputCustomerOrder');
  readonly productsSection = this.modalBody.locator('#products-section');
  readonly productSelects = this.productsSection.locator('select[name="Product"]');
  readonly addProductButton = this.modalBody.locator('#add-product-btn');
  readonly deleteProductButtons = this.modalBody.locator('button.del-btn-modal[title="Delete"]');
  readonly totalPriceDisplay = this.modalFooter.locator('#total-price-order-modal');

  // Footer buttons
  readonly createButton = this.modalFooter.locator('#create-order-btn');

  @logStep('Wait for create order modal to be visible')
  async waitForOpened() {
    await this.uniqueElement.waitFor({ state: 'visible' });
  }

  @logStep('Close create order modal')
  async close() {
    await this.clickCloseButton();
    await this.uniqueElement.waitFor({ state: 'hidden' });
  }

  @logStep('Select customer: {customerName}')
  async selectCustomer(customerName: string) {
    await selectDropdownOption(this.customerSelect, { label: customerName });
  }

  @logStep('Select customer by value: {customerValue}')
  async selectCustomerByValue(customerValue: string) {
    await selectDropdownOption(this.customerSelect, { value: customerValue });
  }

  @logStep('Select product: {productName}')
  async selectProduct(productName: string, productIndex: number = 0) {
    const productSelect = this.productSelects.nth(productIndex);
    await selectDropdownOption(productSelect, { label: productName });
  }

  @logStep('Select product by value: {productValue}')
  async selectProductByValue(productValue: string, productIndex: number = 0) {
    const productSelect = this.productSelects.nth(productIndex);
    await selectDropdownOption(productSelect, { value: productValue });
  }

  @logStep('Add product to order')
  async addProduct() {
    await this.addProductButton.click();
  }

  @logStep('Remove product from order by index: {productIndex}')
  async removeProduct(productIndex: number = 0) {
    const deleteButton = this.deleteProductButtons.nth(productIndex);
    await deleteButton.click();
  }

  @logStep('Remove product by data-delete-id: {deleteId}')
  async removeProductById(deleteId: string) {
    const deleteButton = this.modalBody.locator(`button[data-delete-id="${deleteId}"]`);
    await deleteButton.click();
  }

  @logStep('Create order')
  async createOrder() {
    await this.createButton.click();
    await this.waitForSpinner();
  }

  @logStep('Cancel order creation')
  async cancelCreation() {
    await this.clickCancelButton();
    await this.uniqueElement.waitFor({ state: 'hidden' });
  }

  @logStep('Fill complete order form')
  async fillOrderForm(orderData: {
    customer: string;
    products: Array<{ name: string; value?: string }>;
  }) {
    // Select customer
    await this.selectCustomer(orderData.customer);

    // Add products
    for (const [index, product] of orderData.products.entries()) {
      if (index > 0) {
        await this.addProduct(); // Add additional product fields
      }

      // Select by value if provided, otherwise by name
      if (product.value) {
        await this.selectProductByValue(product.value, index);
      } else {
        await this.selectProduct(product.name, index);
      }
    }
  }

  @logStep('Get modal title text')
  async getTitleText(): Promise<string> {
    return (await this.title.textContent()) || '';
  }

  @logStep('Get total price text')
  async getTotalPrice(): Promise<string> {
    return (await this.totalPriceDisplay.textContent()) || '';
  }

  @logStep('Check if create button is enabled')
  async isCreateButtonEnabled(): Promise<boolean> {
    return await this.createButton.isEnabled();
  }

  @logStep('Get number of products in form')
  async getProductsCount(): Promise<number> {
    return await this.productSelects.count();
  }

  @logStep('Get all available customers')
  async getAvailableCustomers(): Promise<string[]> {
    return await getDropdownOptions(this.customerSelect);
  }

  @logStep('Get all available products for product index: {productIndex}')
  async getAvailableProducts(productIndex: number = 0): Promise<string[]> {
    const productSelect = this.productSelects.nth(productIndex);
    return await getDropdownOptions(productSelect);
  }
}
