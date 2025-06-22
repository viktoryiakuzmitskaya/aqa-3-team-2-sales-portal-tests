import { test, expect } from 'fixtures';
import _ from 'lodash';
import { STATUS_CODES } from 'data/status.code';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { productsSchema } from 'data/schemas/products/products.schema';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { TAGS } from 'data/tags';
import { ERRORS } from 'data/errorMessages';
import { ESortOrder, ESortProductsFields } from 'utils/enum.utils';
import { IProductFromResponse } from 'types/products.types';
import { faker } from '@faker-js/faker';
import { genericSort } from '../../../utils/genericSort';

test.describe('[API] [PRODUCTS] [GET] /api/products', () => {
  let token = '';

  test.beforeAll(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.describe('Positive cases', () => {
    test(
      'Should get all products',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ productService, product }) => {
        const response = await productService.getSorted(token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        const foundProduct = _.find(response.body.Products, { _id: product._id });

        expect(foundProduct).toBeDefined();
        expect(foundProduct).toMatchObject(_.omit(product, 'notes'));
      },
    );

    test(
      'Should search by existing product name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService, product }) => {
        const response = await productService.getSorted(token, { search: product.name });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products).toHaveLength(1);
        expect(response.body.Products[0]).toMatchObject(_.omit(product, 'notes'));
      },
    );

    test(
      'Should filter by manufacturer',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService, product }) => {
        const response = await productService.getSorted(token, {
          manufacturer: product.manufacturer,
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(
          _.every(response.body.Products, { manufacturer: product.manufacturer }),
        ).toBeTruthy();
      },
    );

    test(
      'Should filter by multiple manufacturers',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const manufacturers = [MANUFACTURERS.APPLE, MANUFACTURERS.SAMSUNG];
        const customData = manufacturers.map((m) => ({ manufacturer: m }));
        const createdProducts = await productService.populate(
          manufacturers.length,
          token,
          customData,
        );

        try {
          const response = await productService.getSorted(token, {
            manufacturer: manufacturers,
          } as any);

          validateResponse(response, STATUS_CODES.OK, true, null);
          validateSchema(productsSchema, response.body);
          const productIds = _.map(createdProducts, '_id');
          const responseIds = _.map(response.body.Products, '_id');

          expect(_.difference(productIds, responseIds)).toEqual([]);
        } finally {
          for (const product of createdProducts) {
            await productService.delete(product._id, token);
          }
        }
      },
    );

    test(
      'Should search by price',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService, product }) => {
        const response = await productService.getSorted(token, { search: String(product.price) });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(_.some(response.body.Products, { _id: product._id })).toBeTruthy();
      },
    );

    test.describe('Sorting', () => {
      for (const key of Object.values(ESortProductsFields)) {
        for (const order of Object.values(ESortOrder)) {
          test(
            `Should get products sorted by "${key}" in "${order}" order`,
            { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
            async ({ productService }) => {
              const response = await productService.getSorted(token, {
                sortField: key,
                sortOrder: order,
              });

              validateResponse(response, STATUS_CODES.OK, true, null);
              validateSchema(productsSchema, response.body);

              const products = response.body.Products;
              const sortedResponse = genericSort(products, key, order);
              const isSorted = sortedResponse.every(
                (p: IProductFromResponse, i: number) =>
                  p[key as keyof IProductFromResponse] ===
                  products[i][key as keyof IProductFromResponse],
              );

              expect(
                isSorted,
                `Sorted products should match the expected order for field "${key}"`,
              ).toBe(true);
              expect(response.body.sorting.sortField).toBe(key);
              expect(response.body.sorting.sortOrder).toBe(order);
            },
          );
        }
      }
    });
  });

  test.describe('Negative cases', () => {
    test(
      'Should return empty array for non-existing product name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const nonExistentProductName = `NonExistent_${faker.string.alpha(10)}`;
        const response = await productService.getSorted(token, { search: nonExistentProductName });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBe(0);
      },
    );

    test(
      'Should return 401 for invalid access token',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const invalidToken = faker.string.alpha(20);
        const response = await productService.getSorted(invalidToken);

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
      },
    );

    test(
      'Should return 401 for missing access token',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const response = await productService.getSorted('');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.NOT_AUTHORIZED);
      },
    );

    test(
      'Should return empty array for non-existing product price',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const nonExistentPrice = faker.number.int({ min: 100000, max: 999999 });
        const response = await productService.getSorted(token, {
          search: String(nonExistentPrice),
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBe(0);
      },
    );

    test(
      'Should return empty array for non-existing product manufacturer',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const nonExistentManufacturer = `NonExistent_${faker.company.name()}`;
        const response = await productService.getSorted(token, {
          search: nonExistentManufacturer,
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBe(0);
      },
    );
  });
});
