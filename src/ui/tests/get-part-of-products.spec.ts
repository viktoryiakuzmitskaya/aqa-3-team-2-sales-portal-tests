import { test as testUI } from 'ui/fixtures/ui-services.fixture';
import { test as testAPI, expect } from 'fixtures/services.fixtures';
import { apiConfig } from 'config/api-config';
import { mergeTests } from '@playwright/test';
import { SignInUIService } from 'ui/services/signIn.ui-serivice';
import { ORDER_STATUSES } from 'data/orders/orders.data';
import { RequestedProductsPage } from 'ui/pages/orders/requestedProducts.page';
const test = mergeTests(testUI, testAPI);

const orderIds: string[] = [];
let token: string;

test.describe('Should receiving products in statuses in progress', () => {
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
    orderDetalsHeader,
  }) => {
    // Авторизоваться :
    const signIn = new SignInUIService(page);
    const requestedProduct = new RequestedProductsPage(page);
    const tokenLocalUser = await signIn.signInAsLocalUser();
    token = tokenLocalUser;
    // Создаем заказ в статусе 'In procces' и пушим в orderIds :
    const order = await orderService.createInProsessOrder(tokenLocalUser, 5);
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
    await orderDetalsHeader.waitForOpened();
    const status = await orderDetalsHeader.getOrderStatus();
    expect.soft(status).toBe(ORDER_STATUSES.IN_PROCESS);
    await requestedProduct.clickOnReceive();
    await requestedProduct.waitForSpinner();
    await requestedProduct.checkboxOnAll();
    await requestedProduct.clickOnSave();
    await requestedProduct.waitForSpinner();

    // Стянули названия всех продуктов из Requested Products:
    const [
      firstProductName,
      secondProductName,
      thirdProductName,
      fourthProductName,
      fifthProductName,
    ] = await Promise.all([
      await requestedProduct.getProductName(0),
      await requestedProduct.getProductName(1),
      await requestedProduct.getProductName(2),
      await requestedProduct.getProductName(3),
      await requestedProduct.getProductName(4),
    ]);

    const productFromUI: string[] = [];
    productFromUI.push(
      firstProductName,
      secondProductName,
      thirdProductName,
      fourthProductName,
      fifthProductName,
    );
    expect.soft(createdProductNames).toMatchObject(productFromUI);

    // Стянули статусы каждого из продуктов из Requested Products:
    const [
      firstProductStatus,
      secondProductStatus,
      thirdProductStatus,
      fourthProductStatus,
      fifthProductStatus,
    ] = await Promise.all([
      await requestedProduct.getProductStatus(0),
      await requestedProduct.getProductStatus(1),
      await requestedProduct.getProductStatus(2),
      await requestedProduct.getProductStatus(3),
      await requestedProduct.getProductStatus(4),
    ]);
    expect.soft(firstProductStatus).toBe(ORDER_STATUSES.RECEIVED);
    expect.soft(secondProductStatus).toBe(ORDER_STATUSES.RECEIVED);
    expect.soft(thirdProductStatus).toBe(ORDER_STATUSES.RECEIVED);
    expect.soft(fourthProductStatus).toBe(ORDER_STATUSES.RECEIVED);
    expect.soft(fifthProductStatus).toBe(ORDER_STATUSES.RECEIVED);
    const statusAfterSelectAll = await orderDetalsHeader.getOrderStatus();
    expect(statusAfterSelectAll).toBe(ORDER_STATUSES.RECEIVED);
  });

  test('Should "Received" products statuses, after select part and save', async ({
    page,
    orderService,
    ordersUIService,
    homePage,
    orderDetalsHeader,
  }) => {
    // Авторизоваться :
    const signIn = new SignInUIService(page);
    const requestedProduct = new RequestedProductsPage(page);
    const tokenLocalUser = await signIn.signInAsLocalUser();
    token = tokenLocalUser;
    // Создаем заказ в статусе 'In procces' и пушим в orderIds :
    const order = await orderService.createInProsessOrder(tokenLocalUser, 5);
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
    await orderDetalsHeader.waitForOpened();
    const status = await orderDetalsHeader.getOrderStatus();
    expect.soft(status).toBe(ORDER_STATUSES.IN_PROCESS);
    await requestedProduct.clickOnReceive();
    await requestedProduct.waitForSpinner();
    await requestedProduct.checkByPosition(0).check();
    await requestedProduct.clickOnSave();
    await requestedProduct.waitForSpinner();

    // Стянули названия всех продуктов из Requested Products:
    const firstProductName = await requestedProduct.getProductStatus(0);
    expect.soft(firstProductName).toBe(ORDER_STATUSES.RECEIVED);
    const [secondtProductStatus, thirdProductStatus, fourthProductStatus, fifthProductStatus] =
      await Promise.all([
        await requestedProduct.getProductStatus(1),
        await requestedProduct.getProductStatus(2),
        await requestedProduct.getProductStatus(3),
        await requestedProduct.getProductStatus(4),
      ]);
    expect.soft(secondtProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    expect.soft(thirdProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    expect.soft(fourthProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    expect.soft(fifthProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    const particallyReceivedStatus = await orderDetalsHeader.getOrderStatus();
    expect(particallyReceivedStatus).toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
  });

  test('Should disabled checkbox after select and save', async ({
    page,
    orderService,
    ordersUIService,
    homePage,
    orderDetalsHeader,
  }) => {
    // Авторизоваться :
    const signIn = new SignInUIService(page);
    const requestedProduct = new RequestedProductsPage(page);
    const tokenLocalUser = await signIn.signInAsLocalUser();
    token = tokenLocalUser;
    // Создаем заказ в статусе 'In procces' и пушим в orderIds :
    const order = await orderService.createInProsessOrder(tokenLocalUser, 5);
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
    await orderDetalsHeader.waitForOpened();
    const status = await orderDetalsHeader.getOrderStatus();
    expect.soft(status).toBe(ORDER_STATUSES.IN_PROCESS);
    await requestedProduct.clickOnReceive();
    await requestedProduct.waitForSpinner();
    await requestedProduct.checkByPosition(0).check();
    await requestedProduct.clickOnSave();
    await requestedProduct.waitForSpinner();

    // Стянули названия всех продуктов из Requested Products:
    const disabledCheckbox = await requestedProduct.checkByPosition(0);
    expect.soft(disabledCheckbox).toBeDefined();
    const [secondtProductStatus, thirdProductStatus, fourthProductStatus, fifthProductStatus] =
      await Promise.all([
        await requestedProduct.getProductStatus(1),
        await requestedProduct.getProductStatus(2),
        await requestedProduct.getProductStatus(3),
        await requestedProduct.getProductStatus(4),
      ]);
    expect.soft(secondtProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    expect.soft(thirdProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    expect.soft(fourthProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    expect.soft(fifthProductStatus).toBe(ORDER_STATUSES.NOT_RECEIVED);
    const particallyReceivedStatus = await orderDetalsHeader.getOrderStatus();
    expect(particallyReceivedStatus).toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
  });
});
