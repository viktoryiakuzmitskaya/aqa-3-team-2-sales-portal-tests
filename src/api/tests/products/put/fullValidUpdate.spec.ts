import { test, expect } from 'fixtures/index';
import { generateProductData } from 'data/products/generateProduct.data';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { productSchema } from 'data/schemas/products/product.schema';
import { STATUS_CODES } from 'data/status.code';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { IProduct } from 'types/products.types';
import { TAGS } from 'data/tags';

const initialProductData = generateProductData({ manufacturer: MANUFACTURERS.XIAOMI });
let productId: string;

test.beforeEach(async ({ productService, validToken }) => {
  const createProductResponse = await productService.controller.create(
    initialProductData,
    validToken,
  );
  validateResponse(createProductResponse, STATUS_CODES.CREATED, true, null);
  validateSchema(productSchema, createProductResponse.body);
  productId = createProductResponse.body.Product._id;
});

test(`${TAGS.API} ${TAGS.PRODUCTS} should update all fields of the product`, async ({
  productService,
  validToken,
}) => {
  const updatedProductData: IProduct = {
    ...initialProductData,
    name: initialProductData.name + ' updated',
    manufacturer: MANUFACTURERS.APPLE,
    price: initialProductData.price + 1,
    amount: initialProductData.amount + 1,
    notes: 'updated',
  };
  const updateProductResponse = await productService.controller.updateById(
    updatedProductData,
    productId,
    validToken,
  );
  validateResponse(updateProductResponse, STATUS_CODES.OK, true, null);
  validateSchema(productSchema, updateProductResponse.body);
  expect.soft(updateProductResponse.body.Product).toMatchObject({ ...updatedProductData });
});

test.afterEach(async ({ productService, validToken }) => {
  if (productId) {
    const deleteResponse = await productService.controller.delete(productId, validToken);
    expect.soft(deleteResponse.status).toBe(STATUS_CODES.DELETED);
  }
});
