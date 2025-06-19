import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { IAPICredentials } from 'types/signIn.types';
import { generateProductData } from 'data/products/generateProduct.data';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { faker } from '@faker-js/faker';
import { baseSchema } from 'data/schemas/base.schema';

test.describe('[API] [Products] DELETE /api/products/{id}', () => {
  const user: IAPICredentials = { username: USER_LOGIN, password: USER_PASSWORD };
  let token: string;

  test.beforeEach(async ({ signInController }) => {
    const signInResponse = await signInController.signIn(user);
    token = signInResponse.headers['authorization'];
    expect.soft(signInResponse.status).toBe(STATUS_CODES.OK);
  });

  test('Should delete an existing product', async ({ productController }) => {
    const createResponse = await productController.create(generateProductData(), token);
    const productId = createResponse.body.Product._id;
    expect.soft(createResponse.status).toBe(STATUS_CODES.CREATED);

    const deleteResponse = await productController.delete(productId, token);
    expect.soft(deleteResponse.status).toBe(STATUS_CODES.DELETED);
    expect.soft(deleteResponse.body).not.toBeTruthy();
  });

  test('Should 404 status response, with non-existing product', async ({ productController }) => {
    const invalidProductId = `${faker.database.mongodbObjectId()}`;

    const deleteResponse = await productController.delete(invalidProductId, token);
    expect.soft(deleteResponse.status).toBe(STATUS_CODES.NOT_FOUND);
    validateSchema(baseSchema, deleteResponse.body as any as object);
  });

  test('Should 401 status response, with empty token', async ({ productController }) => {
    const emptyToken = '';
    const createResponse = await productController.create(generateProductData(), token);
    const productId = createResponse.body.Product._id;

    const deleteResponse = await productController.delete(productId, emptyToken);
    expect.soft(deleteResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    validateSchema(baseSchema, deleteResponse.body as any as object);
  });

  test('Should 401 status response, with invalid token', async ({ productController }) => {
    const invalidToken = `${faker.number.int({ max: 400 })}`;
    const createResponse = await productController.create(generateProductData(), token);
    const productId = createResponse.body.Product._id;

    const deleteResponse = await productController.delete(productId, invalidToken);
    expect.soft(deleteResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    validateSchema(baseSchema, deleteResponse.body as any as object);
  });
});
