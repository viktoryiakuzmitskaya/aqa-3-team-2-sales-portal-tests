import { IAPICredentials } from 'types/signIn.types';
import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { generateProductData } from 'data/products/generateProduct.data';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { productSchema } from 'data/schemas/products/product.schema';
import _ from 'lodash';
import { baseSchema } from 'data/schemas/base.schema';
import { faker } from '@faker-js/faker';

test.describe('[API] [Products] POST /api/products', () => {
  const user: IAPICredentials = { username: USER_LOGIN, password: USER_PASSWORD };
  let token: string;
  const productIds = new Set<string>();

  test.beforeEach(async ({ signInController }) => {
    const signInResponse = await signInController.signIn(user);
    token = signInResponse.headers['authorization'];
    expect.soft(signInResponse.status).toBe(STATUS_CODES.OK);
  });

  test.afterEach(async ({ productController }) => {
    const array = [...productIds];
    for (const id of array) {
      const responseDelete = await productController.delete(id, token);
      expect.soft(responseDelete.status).toBe(STATUS_CODES.DELETED);
    }
    productIds.clear();
  });

  test('Should create product with valid data', async ({ productController }) => {
    const productBody = generateProductData();
    const response = await productController.create(productBody, token);

    validateSchema(productSchema, response.body);
    expect.soft(productBody).toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should create product with MIN valid value of attribute "amount" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const minAmountProductBody = productBody;
    minAmountProductBody.amount = 0;

    const response = await productController.create(minAmountProductBody, token);
    validateSchema(productSchema, response.body);
    expect
      .soft(minAmountProductBody)
      .toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should not create product with invalid value of attribute "amount" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const invalidAmountProductBody = productBody;
    invalidAmountProductBody.amount = 1000;

    const response = await productController.create(invalidAmountProductBody, token);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Incorrect request body');
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });

  test('Should create product with MAX valid value of attribute "amount" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const maxAmountProductBody = productBody;
    maxAmountProductBody.amount = 999;

    const response = await productController.create(maxAmountProductBody, token);
    validateSchema(productSchema, response.body);
    expect
      .soft(maxAmountProductBody)
      .toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should not authorized with invalid token ', async ({ productController }) => {
    const productBody = generateProductData();
    const invalidToken = '123';
    const response = await productController.create(productBody, invalidToken);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Invalid access token');
    expect.soft(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
  });

  test('Should not authorized with empty token ', async ({ productController }) => {
    const productBody = generateProductData();
    const emptyToken = '';

    const response = await productController.create(productBody, emptyToken);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Not authorized');
    expect.soft(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
  });

  test('Should not create product with length attribute name < 3', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const invalidNameProductBody = productBody;
    invalidNameProductBody.name = 'ai';

    const response = await productController.create(invalidNameProductBody, token);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Incorrect request body');
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });

  test('Should create product with length attribute name = 3', async ({ productController }) => {
    const productBody = generateProductData({ name: faker.string.alpha(3) });

    const response = await productController.create(productBody, token);
    validateSchema(productSchema, response.body);
    expect.soft(productBody).toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should create product with length attribute name = 40', async ({ productController }) => {
    const productBody = generateProductData({ name: faker.string.alpha(40) });

    const response = await productController.create(productBody, token);
    validateSchema(productSchema, response.body);
    expect.soft(productBody).toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should not create product with invalid MIN board for attribute "price" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const invalidPriceProduct = productBody;
    invalidPriceProduct.price = 0;

    const response = await productController.create(invalidPriceProduct, token);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Incorrect request body');
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });

  test('Should create product with MIN valid value for attribute "price" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const minValidPriceProduct = productBody;
    minValidPriceProduct.price = 1;

    const response = await productController.create(minValidPriceProduct, token);
    validateSchema(productSchema, response.body);
    expect
      .soft(minValidPriceProduct)
      .toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should create product with MAX valid value for attribute "price" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const minValidPriceProduct = productBody;
    minValidPriceProduct.price = 99999;

    const response = await productController.create(minValidPriceProduct, token);
    validateSchema(productSchema, response.body);
    expect
      .soft(minValidPriceProduct)
      .toMatchObject(_.omit(response.body.Product, ['_id', 'createdOn']));
    expect.soft(response.status).toBe(STATUS_CODES.CREATED);

    const productId = response.body.Product._id;
    productIds.add(productId);
  });

  test('Should not create product with invalid MAX board for attribute "price" ', async ({
    productController,
  }) => {
    const productBody = generateProductData();
    const invalidPriceProduct = productBody;
    invalidPriceProduct.price = 100000;

    const response = await productController.create(invalidPriceProduct, token);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Incorrect request body');
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });

  test('Should not create product with invalid MAX board for attribute "notes" ', async ({
    productController,
  }) => {
    const invalidNotesProduct = generateProductData({ notes: 'a'.repeat(251) });

    const response = await productController.create(invalidNotesProduct, token);
    validateSchema(baseSchema, response.body);
    expect.soft(response.body.ErrorMessage).toContain('Incorrect request body');
    expect.soft(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });
});
