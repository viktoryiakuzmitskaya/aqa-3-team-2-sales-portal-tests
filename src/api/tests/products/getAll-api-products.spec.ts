import { test, expect } from 'fixtures/index';
import { STATUS_CODES } from 'data/status.code';
import { generateProductData } from 'data/products/generateProduct.data';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { faker } from '@faker-js/faker';
import { ERRORS } from 'data/errorMessages';
import { productsAllSchema } from 'data/schemas/products/products.all.schema';

test.describe('[API] [Products] GET /api/products/all', () => {
  let token: string;
  let productId: string;

  test.beforeEach(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.afterAll(async ({ productService }) => {
    if (productId) {
      await productService.delete(productId, token);
    }
  });

  test('Should find created product in response body', async ({ productController }) => {
    const productResponse = await productController.create(generateProductData(), token);
    const productBody = productResponse.body.Product;
    const productBodyId = productResponse.body.Product._id;

    const getAllResponse = await productController.getAll(token);
    const productAllBodyProducst = getAllResponse.body.Products;
    const productAllBody = getAllResponse.body;
    const find = productAllBodyProducst.find((product) => product._id === productBodyId);

    expect.soft(find?._id).toEqual(productBodyId);
    expect.soft(getAllResponse.status).toBe(STATUS_CODES.OK);
    expect.soft(find).toMatchObject(productBody as unknown as Record<string, unknown>);
    validateSchema(productsAllSchema, productAllBody);

    productId = productBodyId;
  });

  test('Should 401 status response, with invalid token', async ({ productController }) => {
    const invalidToken = `${faker.number.int({ max: 400 })}`;
    const getAllResponse = await productController.getAll(invalidToken);

    expect.soft(getAllResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(getAllResponse.body.ErrorMessage).toBe(ERRORS.UNAUTHORIZED);
  });

  test('Should 401 status response, with empty token', async ({ productController }) => {
    const emptyToken = '';
    const getAllResponse = await productController.getAll(emptyToken);

    expect.soft(getAllResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect.soft(getAllResponse.body.ErrorMessage).toBe(ERRORS.NOT_AUTHORIZED);
  });
});
