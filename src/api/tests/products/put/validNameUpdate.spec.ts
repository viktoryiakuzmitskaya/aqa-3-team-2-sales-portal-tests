import { test, expect } from 'fixtures/index';
import { faker } from '@faker-js/faker';
import { IProduct } from 'types/products.types';
import { productSchema } from 'data/schemas/products/product.schema';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tags';
import { generateProductData } from 'data/products/generateProduct.data';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { validateResponse } from 'utils/notifications/validations/responseValidation';

let token = '';
let initialProductData: IProduct;
let productId = '';

test.beforeEach(async ({ signInService, productService }) => {
  token = await signInService.loginAsLocalUser();
  initialProductData = generateProductData();
  const createProductResponse = await productService.controller.create(
    initialProductData,
    token,
  );
  validateResponse(createProductResponse, STATUS_CODES.CREATED, true, null);
  validateSchema(productSchema, createProductResponse.body);
  productId = createProductResponse.body.Product._id;
});

const nameLengths = [3, 40];

for (const length of nameLengths) {
  test(`${TAGS.API} ${TAGS.PRODUCTS} should update product name (${length} characters)`, async ({
    productService
  }) => {
    const updatedProductData: IProduct = {
      ...initialProductData,
      name: faker.string.alpha(length),
    };
    const updateProductResponse = await productService.controller.updateById(
      updatedProductData,
      productId,
      token,
    );
    validateResponse(updateProductResponse, STATUS_CODES.OK, true, null);
    validateSchema(productSchema, updateProductResponse.body);
    expect.soft(updateProductResponse.body.Product).toMatchObject({ ...updatedProductData });
  });
}

test.afterEach(async ({ productService }) => {
  if (productId) {
    const deleteResponse = await productService.controller.delete(productId, token);
    expect.soft(deleteResponse.status).toBe(STATUS_CODES.DELETED);
  }
});
