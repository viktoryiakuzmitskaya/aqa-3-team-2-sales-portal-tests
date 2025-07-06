/*import { NOTIFICATIONS } from 'data/notifications.data';
import { TAGS } from 'data/tags';
import { expect, test } from 'ui/fixtures/ui-services.fixture';

test.describe('[UI] [Orders] Orders Smoke tests', async function () {
  let customerId = '';
  let customerName = '';
  let productId = '';
  let productName = '';
  let orderId = '';

  test.beforeEach(async ({ signInUIService, homeUIService, customerService, productService }) => {
    const createdCustomer = await customerService.create();
    customerId = createdCustomer._id;
    customerName = createdCustomer.name;

    const createdProduct = await productService.create();
    productId = createdProduct._id;
    productName = createdProduct.name;

    await signInUIService.openSalesPortal();
    await homeUIService.openOrdersPage();
  });

  test.afterEach(async ({ customerService, ordersService, productService }) => {
    orderId && (await ordersService.delete(orderId));
    customerId && (await customerService.delete(customerId));
    productId && (await productService.delete(productId));
  });

  test(
    'Create Order Smoke test',
    { tag: [TAGS.REGRESSION, TAGS.SMOKE] },
    async function ({ ordersListPageService, page }) {
      const order = {
        customer: customerName,
        products: [productName],
      };

      // Step 1: Open create order modal
      const createOrderModal = await ordersListPageService.openCreateOrderModal();
      await createOrderModal.waitForOpened();

      // Step 2: Verify modal is properly displayed
      await createOrderModal.verifyModalElementsVisible({
        title: true,
        customerSelect: true,
        productsSection: true,
        createButton: true,
      });

      // Step 3: Fill order form
      await createOrderModal.fillOrderForm(order);

      // Step 4: Verify form is filled correctly
      const selectedCustomer = await createOrderModal.customerSelect.textContent();
      expect(selectedCustomer).toContain(customerName);

      const selectedProduct = await createOrderModal.productSelects.first().textContent();
      expect(selectedProduct).toContain(productName);

      // Step 5: Create order
      await createOrderModal.createOrder();
      await createOrderModal.uniqueElement.waitFor({ state: 'hidden' });

      // Step 6: Verify notification
      await ordersListPageService.validateNotification(NOTIFICATIONS.ORDER_CREATED);

      // Step 7: Get created order ID
      orderId = await ordersListPageService.getOrderId(customerName);

      // Step 8: Verify order appears in the table
      await ordersListPageService.checkOrderInTable(order);

      // Step 9: Verify order details by opening it
      await ordersListPageService.navigateToOrderDetails(orderId);
      await expect(page).toHaveURL(new RegExp(`.*#/orders/${orderId}$`));
      await page.goBack();
    },
  );
}); */
