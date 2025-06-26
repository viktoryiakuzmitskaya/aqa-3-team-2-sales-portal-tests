import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { ICreateOrdersData } from 'types/orders.type';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { orderSchemaResponse } from 'data/schemas/orders/order.schema';
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

test.describe('[API], [Orders] GET /api/orders/{id}', () => {
  let token: string;
  let orderId: string;

  test.beforeAll(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.afterAll(async ({ orderService }) => {
    if (orderId) {
      await orderService.fullDelete(orderId, token);
    }
  });

  test('Should get correct response, with the valid productId in query ', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    orderId = responseCreate.body.Order._id;
    const responseGetById = await orderController.getByIdOrder(orderId, token);

    expect.soft(responseGetById.status).toBe(STATUS_CODES.OK);
    expect.soft(responseGetById.body.Order.status).toBe('Draft');
    expect.soft(responseGetById.body.Order).toMatchObject({ ...responseCreate.body.Order });
    validateSchema(orderSchemaResponse, responseGetById.body);
  });

  test('Should get Not Found in response, with the invalid productId in query ', async ({
    orderController,
  }) => {
    const invalidId = `${faker.database.mongodbObjectId()}`;
    const response = await orderController.getByIdOrder(invalidId, token);

    expect.soft(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect.soft(response.body.ErrorMessage).toBe(ERRORS.ORDER_NOT_FOUND(invalidId));
    validateSchema(baseSchema, response.body);
  });

  test('Should 401 , with empty token', async ({ orderController }) => {
    const emptyToken = '';
    const response = await orderController.getByIdOrder(
      `${faker.database.mongodbObjectId()}`,
      emptyToken,
    );

    expect.soft(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(response.body.ErrorMessage).toBe(ERRORS.NOT_AUTHORIZED);
    validateSchema(baseSchema, response.body);
  });

  test('Should 401 , with invalid token', async ({ orderController }) => {
    const invalidToken = `${faker.internet.jwt({ header: { alg: 'HS256' } })}`;
    const response = await orderController.getByIdOrder(
      `${faker.database.mongodbObjectId()}`,
      invalidToken,
    );

    expect.soft(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(response.body.ErrorMessage).toBe(ERRORS.UNAUTHORIZED);
    validateSchema(baseSchema, response.body);
  });
});
