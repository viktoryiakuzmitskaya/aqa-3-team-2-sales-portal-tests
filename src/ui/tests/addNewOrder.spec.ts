import { NOTIFICATIONS } from 'data/notifications.data';
import { TAGS } from 'data/tags';
import { test } from 'fixtures/index';

test.describe('[UI] [Orders] Orders Smoke tests', async function () {
  let customerId = '';
  let customerName = '';
  let productId = '';
  let productName = '';
  let orderId = '';
  let token = '';

  test.beforeEach(async ({ signInUIService, homeUIService, customerService, productService }) => {
    // Создание клиента
    token = await signInUIService.signInAsLocalUser();
    const createdCustomer = await customerService.create(token);
    customerId = createdCustomer._id;
    customerName = createdCustomer.name;

    // Создание продукта
    const createdProduct = await productService.create(token);
    productId = createdProduct._id;
    productName = createdProduct.name;

    await homeUIService.openOrdersPage();
  });

  // Очистка после каждого теста
  test.afterEach(async ({ customerService, orderService, productService }) => {
    // Удаление заказа, если он был создан
    if (orderId) {
      await orderService.delete(orderId, token);
    }
    // Удаление клиента
    if (customerId) {
      await customerService.delete(customerId, token);
    }
    // Удаление продукта
    if (productId) {
      await productService.delete(productId, token);
    }
  });

  test(
    'Create Order Smoke test',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async function ({ ordersUIService, ordersListPage }) {
      // Шаг 1: Открытие модального окна создания заказа
      //await ordersUIService.createNewOrder();
      await ordersListPage.clickCreateOrder();
      await ordersListPage.createOrderModal.waitForOpened();

      // Шаг 2: Заполнение формы заказа
      await ordersListPage.createOrderModal.selectCustomer(customerName);
      await ordersListPage.createOrderModal.selectProduct(productName);

      // Шаг 3: Подтверждение создания заказа
      await ordersListPage.createOrderModal.createOrder();
      await ordersListPage.createOrderModal.waitForClosed();

      // Шаг 4: Проверка notification
      await ordersListPage.notificationsModalPage.isVisible();
      await ordersListPage.notificationsModalPage.verifyNotificationText(
        NOTIFICATIONS.ORDER_CREATED,
      );
      // Шаг 5: Получение информации о созданном заказе
      const orderInfo = await ordersUIService.getOrderInfo(0);
      orderId = orderInfo.orderNumber;

      // Шаг 6: Проверка отображения заказа в списке
      await ordersUIService.verifyOrderInList(orderId);
    },
  );
});
