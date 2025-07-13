import { test as testUI } from 'ui/fixtures/ui-services.fixture';
import { test as testAPI, expect } from 'fixtures/services.fixtures';
import { mergeTests } from '@playwright/test';
import { SignInUIService } from 'ui/services/signIn.ui-serivice';
import { ORDER_STATUSES } from 'data/orders/orders.data';
import { RequestedProductsPage } from 'ui/pages/orders/requestedProducts.page';
const test = mergeTests(testUI, testAPI);

const orderIds: string[] = [];
let token: string;

test.describe('Should receiving products in statuses in progress', () => {
  test.beforeEach(async ({ page }) => {
    const signIn = new SignInUIService(page);
    const tokenLocalUser = await signIn.signInAsLocalUser();
    token = tokenLocalUser;
  });

  test.afterAll(async ({ orderService }) => {
    if (orderIds.length > 0 && token) {
      for (const orderId of orderIds) {
        if (orderId) {
          await orderService.fullDelete(orderId, token);
        }
      }
    }
  });

  test('Should "Received" products statuses, after select all and save', async ({
    page,
    orderService,
    ordersUIService,
    homePage,
    orderDetailsHeader,
  }) => {
    const requestedProduct = new RequestedProductsPage(page);

    const order = await orderService.createInProsessOrder(token, 5);
    const arrayOfProducts = order.products;
    const createdProductNames: string[] = [];
    for (const productObject of arrayOfProducts) {
      if (productObject.name) {
        createdProductNames.push(productObject.name);
      }
    }
    const orderId = order._id;
    orderIds.push(orderId);

    await homePage.clickModuleButton('Orders');
    await ordersUIService.searchOrders(orderId);
    await ordersUIService.openOrderDetails(orderId);
    await orderDetailsHeader.waitForOpened();
    await requestedProduct.clickOnReceive();
    await requestedProduct.waitForSpinner();
    await requestedProduct.checkboxOnAll();
    await requestedProduct.clickOnSave();
    await requestedProduct.waitForSpinner();

    // Сравнили названия созданных продуктов с названиями продуктов на UI :
    const productNames: string[] = await requestedProduct.productsAccordionSection
      .locator('.accordion-header .accordion-button')
      .allInnerTexts();
    expect.soft(createdProductNames).toMatchObject(productNames);

    // Сравнили статусы созданных продуктов после выбора всех чек-боксов:
    const productsStatuses: string[] = await requestedProduct.productsAccordionSection
      .locator('.accordion-header .align-items-center')
      .allInnerTexts();
    expect(productsStatuses.every((status) => status === ORDER_STATUSES.RECEIVED)).toBeTruthy();
  });

  test('Should "Received" products statuses, after select part and save', async ({
    page,
    orderService,
    ordersUIService,
    homePage,
    orderDetailsHeader,
  }) => {
    const requestedProduct = new RequestedProductsPage(page);

    // Создаем заказ в статусе 'In procces' и пушим в orderIds :
    const order = await orderService.createInProsessOrder(token, 5);
    const arrayOfProducts = order.products;
    const createdProductNames: string[] = [];
    for (const productObject of arrayOfProducts) {
      if (productObject.name) {
        createdProductNames.push(productObject.name);
      }
    }
    const orderId = order._id;
    orderIds.push(orderId);

    await homePage.clickModuleButton('Orders');
    await ordersUIService.searchOrders(orderId);
    await ordersUIService.openOrderDetails(orderId);
    await orderDetailsHeader.waitForOpened();
    await requestedProduct.clickOnReceive();
    await requestedProduct.waitForSpinner();
    await requestedProduct.checkByPosition(0).check();
    await requestedProduct.clickOnSave();
    await requestedProduct.waitForSpinner();

    // Проверяем что переведенный в received заказ имеет соот-ий статус :
    const firstProduct = await requestedProduct.getProductStatus(0);
    expect.soft(firstProduct).toBe(ORDER_STATUSES.RECEIVED);
    const productsStatuses: string[] = await requestedProduct.productsAccordionSection
      .locator('.accordion-header .align-items-center')
      .allInnerTexts();
    const notReceivedProducts: string[] = [];
    for (const status of productsStatuses) {
      if (status === ORDER_STATUSES.NOT_RECEIVED) {
        notReceivedProducts.push(status);
      }
    }
    expect
      .soft(notReceivedProducts.every((status) => status === ORDER_STATUSES.NOT_RECEIVED))
      .toBe(true);
  });

  test('Should disabled checkbox after select and save', async ({
    page,
    orderService,
    ordersUIService,
    homePage,
    orderDetailsHeader,
  }) => {
    const requestedProduct = new RequestedProductsPage(page);

    // Создаем заказ в статусе 'In procces' и пушим в orderIds :
    const order = await orderService.createInProsessOrder(token, 5);
    const orderId = order._id;
    orderIds.push(orderId);

    await homePage.clickModuleButton('Orders');
    await ordersUIService.searchOrders(orderId);
    await ordersUIService.openOrderDetails(orderId);
    await orderDetailsHeader.waitForOpened();
    await requestedProduct.clickOnReceive();
    await requestedProduct.waitForSpinner();
    await requestedProduct.checkByPosition(0).check();
    await requestedProduct.clickOnSave();
    await requestedProduct.waitForSpinner();
    await requestedProduct.clickOnReceive();

    const updatedCheckbox = await requestedProduct.checkByPosition(0);

    await expect(updatedCheckbox).toBeVisible();
    await expect(updatedCheckbox).toBeDisabled();
  });
});
