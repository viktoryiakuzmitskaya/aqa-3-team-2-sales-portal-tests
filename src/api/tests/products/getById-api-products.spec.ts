import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { IAPICredentials } from 'types/signIn.types';
import { generateProductData } from 'data/products/generateProduct.data';
import _ from 'lodash';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { productSchema } from 'data/schemas/products/product.schema';
import { faker } from '@faker-js/faker';
import { ERRORS } from 'data/errorMessages';
import { baseSchema } from 'data/schemas/base.schema';

test.describe('[API] [Products] GET /api/products/{id}', () => {
  const user: IAPICredentials = { username: USER_LOGIN, password: USER_PASSWORD };
  let token: string;
  const productIds = new Set<string>();

  test.beforeEach(async ({ signInController }) => {
    const signInResponse = await signInController.signIn(user);
    token = signInResponse.headers['authorization'];
    expect.soft(signInResponse.status).toBe(STATUS_CODES.OK);
  });
  test.afterEach(async ({ productController }) => {
    const arr = [...productIds];
    for (const id of arr) {
      const deleteResponse = await productController.delete(id, token);
      expect.soft(deleteResponse.status).toBe(STATUS_CODES.DELETED);
    }
  });

  test('Should found a valid product', async ({ productController, productService }) => {
    const product = await productService.create(token, generateProductData());
    const productId = product._id;
    const getByIdResponse = await productController.getById(productId, token);
    expect.soft(getByIdResponse.status).toBe(STATUS_CODES.OK);
    expect.soft(product).toMatchObject(_.omit(getByIdResponse.body.Product, ['_id', 'createdOn']));
    validateSchema(productSchema, getByIdResponse.body);
    productIds.add(productId);
  });

  test('Should not found product using an invalid id', async ({ productController }) => {
    const invalidProductId = faker.database.mongodbObjectId();
    const getByIdResponse = await productController.getById(invalidProductId, token);
    expect.soft(getByIdResponse.status).toBe(STATUS_CODES.NOT_FOUND);
    expect.soft(getByIdResponse.body.ErrorMessage).toBe(ERRORS.PRODUCT_NOT_FOUND(invalidProductId));
    validateSchema(baseSchema, getByIdResponse.body);
  });

  test('Should be 401 response status, with empty header authorization', async ({
    productController,
  }) => {
    const invalidProductId = `${faker.number.int({ max: 400 })}`;
    const emtyToken = '';
    const getByIdResponse = await productController.getById(invalidProductId, emtyToken);
    expect.soft(getByIdResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(getByIdResponse.body.ErrorMessage).toBe(ERRORS.NOT_AUTHORIZED);
    validateSchema(baseSchema, getByIdResponse.body);
  });

  test('Should be 401 response status, with invalid header authorization', async ({
    productController,
  }) => {
    const invalidProductId = `${faker.number.int({ max: 400 })}`;
    const invalidToken = `${faker.internet.jwt({ header: { alg: 'HS256' } })}`;
    const getByIdResponse = await productController.getById(invalidProductId, invalidToken);
    expect.soft(getByIdResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(getByIdResponse.body.ErrorMessage).toBe(ERRORS.UNAUTHORIZED);
    validateSchema(baseSchema, getByIdResponse.body);
  });
});
