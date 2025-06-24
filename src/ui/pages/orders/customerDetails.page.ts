import { SalesPortalPage } from '../salesPortal.page';

export class CustomerDetailsPage extends SalesPortalPage {
  readonly title = this.page.locator('.modal-title').filter({ hasText: 'Customer Details' });
  uniqueElement = this.title;
  readonly editCustomerPencil = this.page.locator('#edit-customer-pencil');
  readonly customerDetails = this.page.locator('#customer-section .c-details');
  readonly productDetailSelector = '.c-details';
  readonly productNameSelector = 'span.s-span';
  readonly customerSection = this.page.locator('#customer-section');

  async clickOnEditCustomer() {
    await this.editCustomerPencil.click();
  }
}
