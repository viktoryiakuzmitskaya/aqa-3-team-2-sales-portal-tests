import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { ICreateOrdersData } from 'types/orders.type';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { orderSchemaResponse } from 'data/schemas/orders/order.schema';
import { ORDER_STATUSES } from 'data/orders/orders.data';

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

test.describe('[API] [Orders] POST /api/orders', () => {
  let token: string;
  const products: string[] = [];
  const customers: string[] = [];
  const orders: string[] = [];

  test.beforeEach(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.afterAll(async ({ orderService }) => {
    for (const orderId of orders) {
      await orderService.fullDelete(orderId, token);
    }
  });

  test('Should create order with 1 product', async ({
    orderController,
    customerService,
    productService,
  }) => {
    const data = await createOrderData(customerService, productService, token);
    const response = await orderController.createOrder(data, token);
    orders.push(response.body.Order._id);
    const productDataIds: string[] = [];
    for (const productOfResponse of response.body.Order.products) {
      productDataIds.push(productOfResponse._id);
    }

    expect.soft(response.status).toBe(STATUS_CODES.CREATED);
    expect.soft(response.body.Order.status).toBe(ORDER_STATUSES.DRAFT);
    expect.soft(data.products).toEqual(productDataIds);
    expect.soft(data.customer).toBe(response.body.Order.customer._id);
    validateSchema(orderSchemaResponse, response.body);
  });

  test('Should create order with 5 product', async ({
    orderController,
    customerService,
    productService,
  }) => {
    const data = await createOrderData(customerService, productService, token, 5);
    customers.push(data.customer);
    products.push(...data.products);

    const response = await orderController.createOrder(data, token);
    orders.push(response.body.Order._id);

    expect.soft(response.status).toBe(STATUS_CODES.CREATED);
    expect.soft(response.body.Order.status).toBe(ORDER_STATUSES.DRAFT);
    const productDataIds: string[] = [];
    for (const productId of response.body.Order.products) {
      productDataIds.push(productId._id);
    }
    expect.soft(data.products).toEqual(productDataIds);
    expect.soft(data.customer).toBe(response.body.Order.customer._id);
    validateSchema(orderSchemaResponse, response.body);
  });

  test('Should not create order with 6 product', async ({
    orderController,
    customerService,
    productService,
  }) => {
    const data = await createOrderData(customerService, productService, token, 6);
    customers.push(data.customer);
    products.push(...data.products);

    const response = await orderController.createOrder(data, token);
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });

  test('Should not create order with empty products array', async ({
    orderController,
    customerService,
    productService,
  }) => {
    const data = await createOrderData(customerService, productService, token, 0);
    customers.push(data.customer);
    products.push(...data.products);

    const response = await orderController.createOrder(data, token);
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });
});
