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

test.describe('[API], [Orders] PUT /api/orders/{id}', () => {
  let token: string;
  const orderIds: string[] = [];

  test.beforeAll(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.afterAll(async ({ orderService }) => {
    for (const orderId of orderIds) {
      if (orderId) {
        await orderService.fullDelete(orderId, token);
      }
    }
  });

  test('Should status 200 with equal request data, after add 1 new product in products Array', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    const cutomerId = responseCreate.body.Order.customer._id;
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const updatedProductId = (await productService.create(token))._id;
    const newProductsArr: string[] = [responseCreate.body.Order.products[0]._id, updatedProductId];
    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: newProductsArr,
    };
    const updateResponse = await orderController.updateOrder(orderId, updatedData, token);
    const productsArrayFromUpdateResponse: string[] = [];

    for (const productId of updateResponse.body.Order.products) {
      productsArrayFromUpdateResponse.push(productId._id);
    }

    expect.soft(updateResponse.status).toBe(STATUS_CODES.OK);
    expect.soft(updateResponse.body.Order.status).toBe('Draft');
    expect.soft(updateResponse.body.Order.customer._id).toBe(cutomerId);
    expect
      .soft(updateResponse.body.Order.customer._id)
      .toBe(responseCreate.body.Order.customer._id);
    expect.soft(newProductsArr).toMatchObject(productsArrayFromUpdateResponse);
    validateSchema(orderSchemaResponse, updateResponse.body);
  });

  test('Should status 200 with equal request data, after add 5-th product in products Array', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token, 4);
    const responseCreate = await orderController.createOrder(data, token);
    const cutomerId = responseCreate.body.Order.customer._id;
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const updatedProductId = (await productService.create(token))._id;
    const productsArrFromResponseCreate: string[] = [];
    for (const productId of responseCreate.body.Order.products) {
      productsArrFromResponseCreate.push(productId._id);
    }
    const newProductsArr: string[] = [...productsArrFromResponseCreate, updatedProductId];
    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: newProductsArr,
    };
    const updateResponse = await orderController.updateOrder(orderId, updatedData, token);
    const productsArrayFromUpdateResponse: string[] = [];

    for (const productId of updateResponse.body.Order.products) {
      productsArrayFromUpdateResponse.push(productId._id);
    }

    expect.soft(updateResponse.status).toBe(STATUS_CODES.OK);
    expect.soft(updateResponse.body.Order.status).toBe('Draft');
    expect.soft(updateResponse.body.Order.customer._id).toBe(cutomerId);
    expect
      .soft(updateResponse.body.Order.customer._id)
      .toBe(responseCreate.body.Order.customer._id);
    expect.soft(newProductsArr).toMatchObject(productsArrayFromUpdateResponse);
    validateSchema(orderSchemaResponse, updateResponse.body);
  });

  test('Should status 404, after add invalid productIn in array', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const invalidProductId = `${faker.database.mongodbObjectId()}`;
    const productsArrFromResponseCreate: string[] = [];
    for (const productId of responseCreate.body.Order.products) {
      productsArrFromResponseCreate.push(productId._id);
    }
    const newProductsArr: string[] = [...productsArrFromResponseCreate, invalidProductId];
    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: newProductsArr,
    };
    const updateResponse = await orderController.updateOrder(orderId, updatedData, token);

    expect.soft(updateResponse.status).toBe(STATUS_CODES.NOT_FOUND);
    expect.soft(updateResponse.body.ErrorMessage).toBe(ERRORS.PRODUCT_NOT_FOUND(invalidProductId));
    validateSchema(baseSchema, updateResponse.body);
  });

  test('Should status 400, after add 6-th product', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token, 5);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const sixthProductId = `${faker.database.mongodbObjectId()}`;
    const productsArrFromResponseCreate: string[] = [];
    for (const productId of responseCreate.body.Order.products) {
      productsArrFromResponseCreate.push(productId._id);
    }
    const newProductsArr: string[] = [...productsArrFromResponseCreate, sixthProductId];
    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: newProductsArr,
    };
    const updateResponse = await orderController.updateOrder(orderId, updatedData, token);
    const body = updateResponse.body as any;
    expect.soft(updateResponse.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect.soft(body.SchemaErrors[0].message).toBe('must NOT have more than 5 items');
  });

  test('Should status 400, after add request with empty products array', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token, 5);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);
    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: [],
    };
    const updateResponse = await orderController.updateOrder(orderId, updatedData, token);
    const body = updateResponse.body as any;
    expect.soft(updateResponse.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect.soft(body.SchemaErrors[0].message).toBe('must NOT have fewer than 1 items');
  });

  test('Should status 404, with invalid customer', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const updatedData = {
      customer: `${faker.database.mongodbObjectId()}`,
      products: [responseCreate.body.Order.products[0]._id],
    };
    const updateResponse = await orderController.updateOrder(orderId, updatedData, token);
    expect.soft(updateResponse.status).toBe(STATUS_CODES.NOT_FOUND);
    expect
      .soft(updateResponse.body.ErrorMessage)
      .toBe(ERRORS.CUSTOMER_NOT_FOUND(updatedData.customer));
  });

  test('Should status 401, with empty token', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: [responseCreate.body.Order.products[0]._id],
    };
    const emptyToken = '';
    const updateResponse = await orderController.updateOrder(orderId, updatedData, emptyToken);
    expect.soft(updateResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(updateResponse.body.ErrorMessage).toBe(ERRORS.NOT_AUTHORIZED);
  });

  test('Should status 401, with invalid token', async ({
    customerService,
    productService,
    orderController,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const responseCreate = await orderController.createOrder(data, token);
    const orderId = responseCreate.body.Order._id;
    orderIds.push(orderId);

    const updatedData = {
      customer: responseCreate.body.Order.customer._id,
      products: [responseCreate.body.Order.products[0]._id],
    };
    const invalidToken = `${faker.internet.jwt({ header: { alg: 'HS256' } })}`;
    const updateResponse = await orderController.updateOrder(orderId, updatedData, invalidToken);
    expect.soft(updateResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(updateResponse.body.ErrorMessage).toBe(ERRORS.UNAUTHORIZED);
  });
});
