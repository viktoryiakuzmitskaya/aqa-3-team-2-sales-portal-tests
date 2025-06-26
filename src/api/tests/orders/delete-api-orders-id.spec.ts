import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { ICreateOrdersData } from 'types/orders.type';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { faker } from '@faker-js/faker';
import { ERRORS } from 'data/errorMessages';
import { baseSchema } from 'data/schemas/base.schema';

async function createOrderData(
  customerService: any,
  productService: any,
  token?: any,
  numberOFProducts: number = 1,
) {
  if (typeof numberOFProducts !== 'number') {
    throw new Error('Incorrect type of Products');
  }
  const customer = await customerService.create(token);
  const product = await productService.create(token);
  const orderData: ICreateOrdersData = {
    customer: customer._id,
    products: [],
  };

  for (let i = 1; i <= numberOFProducts; i++) {
    orderData.products.push(product._id);
  }
  return orderData;
}

test.describe('[API], [Orders] DELETE /api/orders/{id}', () => {
  let token: string;
  const productIds: string[] = [];
  const customerIds: string[] = [];

  test.beforeAll(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.afterAll(async ({ customerService, productService }) => {
    for (const productId of productIds) {
      if (productId) {
        await productService.delete(productId, token);
      }
    }

    for (const customerId of customerIds) {
      if (customerId) {
        await customerService.delete(customerId, token);
      }
    }
  });

  test('Should delete correct order', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;

    productIds.push(responseCreate.body.Order.products[0]._id);
    customerIds.push(responseCreate.body.Order.customer._id);

    const deleteOrder = await orderController.deleteOrder(orderId, token);
    expect(deleteOrder.status).toBe(STATUS_CODES.DELETED);
    expect(deleteOrder.body).toEqual('');
  });

  test('Should 404 with invalid order', async ({ orderController }) => {
    const orderId = `${faker.database.mongodbObjectId()}`;

    const deleteOrder: any = await orderController.deleteOrder(orderId, token);
    expect(deleteOrder.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(deleteOrder.body.ErrorMessage).toBe(ERRORS.ORDER_NOT_FOUND(orderId));
    validateSchema(baseSchema, deleteOrder.body);
  });

  test('Should 401 with empty token', async ({ orderController }) => {
    const orderId = `${faker.database.mongodbObjectId()}`;
    const emptyToken = '';

    const deleteOrder: any = await orderController.deleteOrder(orderId, emptyToken);
    expect(deleteOrder.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(deleteOrder.body.ErrorMessage).toBe(ERRORS.NOT_AUTHORIZED);
    validateSchema(baseSchema, deleteOrder.body);
  });

  test('Should 401 with invalid token', async ({ orderController }) => {
    const orderId = `${faker.database.mongodbObjectId()}`;
    const invalidToken = `${faker.database.mongodbObjectId()}`;

    const deleteOrder: any = await orderController.deleteOrder(orderId, invalidToken);
    expect(deleteOrder.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(deleteOrder.body.ErrorMessage).toBe(ERRORS.UNAUTHORIZED);
    validateSchema(baseSchema, deleteOrder.body);
  });
});
