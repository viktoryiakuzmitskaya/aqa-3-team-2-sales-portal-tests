import { test, expect } from 'fixtures/index';
import { faker } from '@faker-js/faker';
import { IProduct } from 'types/products.types';
import { productSchema } from 'data/schemas/products/product.schema';
import { baseSchema } from 'data/schemas/base.schema';
import { STATUS_CODES } from 'data/status.code';
import { ERRORS } from 'data/errorMessages';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { TAGS } from 'data/tags';
import { generateProductData } from 'data/products/generateProduct.data';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { validateResponse } from 'utils/notifications/validations/responseValidation';

test.describe(`${TAGS.API} ${TAGS.PRODUCTS} Product Update`, () => {
  let token = '';
  let initialProductData: IProduct;
  let productId = '';

  test.beforeEach(async ({ signInService, productService }) => {
    token = await signInService.loginAsLocalUser();
    initialProductData = generateProductData();
    const createProductResponse = await productService.controller.create(initialProductData, token);
    validateResponse(createProductResponse, STATUS_CODES.CREATED, true, null);
    validateSchema(productSchema, createProductResponse.body);
    productId = createProductResponse.body.Product._id;
  });

  test('should update all fields of the product', async ({ productService }) => {
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
      token,
    );
    validateResponse(updateProductResponse, STATUS_CODES.OK, true, null);
    validateSchema(productSchema, updateProductResponse.body);
    expect.soft(updateProductResponse.body.Product).toMatchObject({ ...updatedProductData });
  });

  test('should not update product with invalid token', async ({ productService }) => {
    const updatedProductData: IProduct = {
      ...initialProductData,
      name: initialProductData.name + ' updated',
      manufacturer: MANUFACTURERS.APPLE,
      price: initialProductData.price + 1,
      amount: initialProductData.amount + 1,
      notes: 'updated',
    };
    const invalidToken = 'invalid_token';
    const updateProductResponse = await productService.controller.updateById(
      updatedProductData,
      productId,
      invalidToken,
    );
    validateSchema(baseSchema, updateProductResponse.body);
    validateResponse(updateProductResponse, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
  });

  test('should update manufacturer of the product', async ({ productService }) => {
    const updatedProductData: IProduct = {
      ...initialProductData,
      manufacturer: MANUFACTURERS.GOOGLE,
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

  [1, 999].forEach((amount) => {
    test(`should update product amount to ${amount}`, async ({ productService }) => {
      const updatedProductData: IProduct = {
        ...initialProductData,
        amount,
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
  });

  [1000].forEach((amount) => {
    test(`should not update product amount to ${amount}`, async ({ productService }) => {
      const updatedProductData: IProduct = {
        ...initialProductData,
        amount,
      };
      const updateProductResponse = await productService.controller.updateById(
        updatedProductData,
        productId,
        token,
      );
      validateSchema(baseSchema, updateProductResponse.body);
      validateResponse(
        updateProductResponse,
        STATUS_CODES.BAD_REQUEST,
        false,
        ERRORS.INCORRECT_REQUEST_BODY,
      );
    });
  });

  [1, 99999].forEach((price) => {
    test(`should update product price to ${price}`, async ({ productService }) => {
      const updatedProductData: IProduct = {
        ...initialProductData,
        price,
      };
      const updateProductResponse = await productService.controller.updateById(
        updatedProductData,
        productId,
        token,
      );
      validateSchema(productSchema, updateProductResponse.body);
      validateResponse(updateProductResponse, STATUS_CODES.OK, true, null);
      expect.soft(updateProductResponse.body.Product).toMatchObject({ ...updatedProductData });
    });
  });

  [0, 100000].forEach((price) => {
    test(`should not update product price to ${price}`, async ({ productService }) => {
      const updatedProductData: IProduct = {
        ...initialProductData,
        price,
      };
      const updateProductResponse = await productService.controller.updateById(
        updatedProductData,
        productId,
        token,
      );
      validateSchema(baseSchema, updateProductResponse.body);
      validateResponse(
        updateProductResponse,
        STATUS_CODES.BAD_REQUEST,
        false,
        ERRORS.INCORRECT_REQUEST_BODY,
      );
    });
  });

  [3, 40].forEach((length) => {
    test(`should update product name with ${length} characters`, async ({ productService }) => {
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
  });

  [2, 41].forEach((length) => {
    test(`should not update product name with ${length} characters`, async ({ productService }) => {
      const updatedProductData: IProduct = {
        ...initialProductData,
        name: faker.string.alpha(length),
      };
      const updateProductResponse = await productService.controller.updateById(
        updatedProductData,
        productId,
        token,
      );
      validateSchema(baseSchema, updateProductResponse.body);
      validateResponse(
        updateProductResponse,
        STATUS_CODES.BAD_REQUEST,
        false,
        ERRORS.INCORRECT_REQUEST_BODY,
      );
    });
  });

  test.afterEach(async ({ productService }) => {
    if (productId) {
      const deleteResponse = await productService.controller.delete(productId, token);
      expect.soft(deleteResponse.status).toBe(STATUS_CODES.DELETED);
    }
  });
});
