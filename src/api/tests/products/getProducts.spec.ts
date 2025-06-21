import { test, expect } from 'fixtures';
import { STATUS_CODES } from 'data/status.code';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { productsSchema } from 'data/schemas/products/products.schema';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { TAGS } from 'data/tags';
import { ERRORS } from 'data/errorMessages';
import { ESortOrder, ESortProductsFields } from 'utils/enum.utils';

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

        const foundProduct = response.body.Products.find((p) => p._id === product._id);

        expect(foundProduct).toBeDefined();

        const { ...productBodyWithoutNotes } = product;

        expect(foundProduct).toMatchObject(productBodyWithoutNotes);
      },
    );

    test(
      'Should search by existing product name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService, product }) => {
        const response = await productService.getSorted(token, { search: product.name });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBeGreaterThan(0);
        expect(response.body.Products.every((p) => p.name.includes(product.name))).toBeTruthy();
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
          response.body.Products.every((p) => p.manufacturer === product.manufacturer),
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
          const productIds = createdProducts.map((p) => p._id);
          const responseIds = response.body.Products.map((p) => p._id);

          expect(productIds.every((id) => responseIds.includes(id))).toBeTruthy();
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

        expect(response.body.Products.some((p) => p._id === product._id)).toBeTruthy();
      },
    );

    test.describe('Sorting', () => {
      for (const sortField of Object.values(ESortProductsFields)) {
        for (const sortOrder of Object.values(ESortOrder)) {
          test(
            `Should sort by ${sortField} ${sortOrder}`,
            {
              tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION],
            },
            async ({ productService }) => {
              const response = await productService.getSorted(token, {
                sortField,
                sortOrder,
              });

              validateResponse(response, STATUS_CODES.OK, true, null);
              validateSchema(productsSchema, response.body);

              expect(response.body.sorting.sortField).toBe(sortField);
              expect(response.body.sorting.sortOrder).toBe(sortOrder);
              expect(Array.isArray(response.body.Products)).toBe(true);
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
        const response = await productService.getSorted(token, { search: 'nonexistentproduct' });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBe(0);
      },
    );

    test(
      'Should return 401 for invalid access token',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const response = await productService.getSorted('invalidtoken');

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
        const response = await productService.getSorted(token, { search: '9999999' });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBe(0);
      },
    );

    test(
      'Should return empty array for non-existing product manufacturer',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productService }) => {
        const response = await productService.getSorted(token, {
          search: 'NonExistentManufacturer',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(productsSchema, response.body);

        expect(response.body.Products.length).toBe(0);
      },
    );
  });
});
