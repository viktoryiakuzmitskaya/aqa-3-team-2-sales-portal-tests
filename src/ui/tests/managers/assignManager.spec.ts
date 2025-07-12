import { TAGS } from 'data/tags';
import { expect, test } from '../../../fixtures/index';

test.describe('[UI] [Orders] Assign Manager Tests', () => {
  let customerId = '';
  let productId = '';
  let orderId = '';
  let token = '';
  let managerUsername = '';

  test.beforeEach(
    async ({ signInUIService, homeUIService, customerService, productService, orderService }) => {
      // Авторизация
      token = await signInUIService.signInAsLocalUser();

      // Создание клиента
      const createdCustomer = await customerService.create(token);
      customerId = createdCustomer._id;

      // Создание продукта
      const createdProduct = await productService.create(token);
      productId = createdProduct._id;

      // Создание заказа через API (быстрее для setup)
      const createdOrder = await orderService.createDraftOrder(token);
      orderId = createdOrder._id;

      // Получаем username текущего пользователя для назначения
      managerUsername = 'Sam'; // Current user's username (with capital S)

      // Открываем страницу с заказами
      await homeUIService.openOrdersPage();
    },
  );

  test.afterEach(async ({ customerService, orderService, productService }) => {
    // Очистка данных
    if (orderId) {
      await orderService.fullDelete(orderId, token);
    }
    if (customerId) {
      await customerService.delete(customerId, token);
    }
    if (productId) {
      await productService.delete(productId, token);
    }
  });

  test(
    'Should assign manager to order successfully',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ ordersUIService, orderDetailsPage, orderDetailsHeader, assignManagerModal, page }) => {
      // Шаг 1: Переходим к деталям заказа
      await ordersUIService.openOrderDetails(orderId);
      await orderDetailsPage.waitForOpened();

      // Шаг 2: Проверяем что менеджер не назначен
      const initialManagerText = await orderDetailsHeader.getAssignedManagerName();
      expect(initialManagerText).toBe('Click to select manager');

      // Шаг 3: Настраиваем перехват API запроса для назначения менеджера
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/orders') &&
          response.url().includes('/assign-manager') &&
          response.request().method() === 'PUT' &&
          response.status() === 200,
      );

      // Шаг 4: Открываем модальное окно назначения менеджера
      await orderDetailsHeader.clickEditAssigned();
      await assignManagerModal.waitForOpened();

      // Шаг 5: Выбираем менеджера
      await assignManagerModal.selectManager(managerUsername);

      // Шаг 6: Сохраняем изменения
      await assignManagerModal.clickSaveButton();
      await assignManagerModal.waitForClosed();

      // Шаг 7: Проверяем API ответ
      const response = await responsePromise;
      const responseBody = await response.json();

      expect(responseBody.IsSuccess).toBe(true);
      expect(responseBody.Order.assignedManager).toBeDefined();
      expect(responseBody.Order.assignedManager._id).toBe(responseBody.Order.assignedManager._id);
      expect(responseBody.Order.assignedManager.username).toBe(managerUsername);

      // Шаг 8: Проверяем что менеджер отображается в UI
      await page.waitForTimeout(1000); // Ждем обновления UI
      const assignedManagerText = await orderDetailsHeader.getAssignedManagerName();
      expect(assignedManagerText).toContain(managerUsername);
    },
  );

  test(
    'Should search and assign manager from search results',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ ordersUIService, orderDetailsPage, orderDetailsHeader, assignManagerModal, page }) => {
      // Шаг 1: Переходим к деталям заказа
      await ordersUIService.openOrderDetails(orderId);
      await orderDetailsPage.waitForOpened();

      // Шаг 2: Открываем модальное окно назначения менеджера
      await orderDetailsHeader.clickEditAssigned();
      await assignManagerModal.waitForOpened();

      // Шаг 3: Используем поиск для нахождения менеджера
      await assignManagerModal.typeSearch('sa');

      // Шаг 4: Выбираем менеджера из результатов поиска
      await assignManagerModal.selectManager(managerUsername);

      // Шаг 5: Сохраняем изменения
      await assignManagerModal.clickSaveButton();
      await assignManagerModal.waitForClosed();

      // Шаг 6: Проверяем результат
      await page.waitForTimeout(1000); // Ждем обновления UI
      const assignedManagerText = await orderDetailsHeader.getAssignedManagerName();
      expect(assignedManagerText).toContain(managerUsername);
    },
  );

  test(
    'Should cancel manager assignment',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ ordersUIService, orderDetailsPage, orderDetailsHeader, assignManagerModal }) => {
      // Шаг 1: Переходим к деталям заказа
      await ordersUIService.openOrderDetails(orderId);
      await orderDetailsPage.waitForOpened();

      // Шаг 2: Сохраняем изначальное состояние
      const initialManagerText = await orderDetailsHeader.getAssignedManagerName();

      // Шаг 3: Открываем модальное окно назначения менеджера
      await orderDetailsHeader.clickEditAssigned();
      await assignManagerModal.waitForOpened();

      // Шаг 4: Выбираем менеджера
      await assignManagerModal.selectManager(managerUsername);

      // Шаг 5: Отменяем назначение
      await assignManagerModal.clickCancelButton();
      await assignManagerModal.waitForClosed();

      // Шаг 6: Проверяем что состояние не изменилось
      const finalManagerText = await orderDetailsHeader.getAssignedManagerName();
      expect(finalManagerText).toBe(initialManagerText);
    },
  );

  test(
    'Should close manager assignment modal with X button',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ ordersUIService, orderDetailsPage, orderDetailsHeader, assignManagerModal }) => {
      // Шаг 1: Переходим к деталям заказа
      await ordersUIService.openOrderDetails(orderId);
      await orderDetailsPage.waitForOpened();

      // Шаг 2: Открываем модальное окно назначения менеджера
      await orderDetailsHeader.clickEditAssigned();
      await assignManagerModal.waitForOpened();

      // Шаг 3: Закрываем модальное окно кнопкой X
      await assignManagerModal.clickCloseButton();
      await assignManagerModal.waitForClosed();

      // Шаг 4: Проверяем что модальное окно закрыто
      await expect(assignManagerModal.uniqueElement).not.toBeVisible();
    },
  );
});
