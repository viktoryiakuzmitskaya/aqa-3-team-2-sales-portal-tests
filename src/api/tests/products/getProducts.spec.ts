import { test, expect } from 'fixtures';
import { STATUS_CODES } from 'data/status.code';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { productsSchema } from 'data/schemas/products/products.schema';
import { generateProductData } from 'data/products/generateProduct.data';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { TAGS } from 'data/tags';
import { ERRORS } from 'data/errorMessages';
import _ from 'lodash';


test.describe('[API] [PRODUCTS] [GET] /api/products', () => {
  let token = '';
  let productIds: string[] = [];

  test.beforeAll(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });

  test.afterEach(async ({ productService }) => {
    for (const id of productIds) {
      try {
        await productService.controller.delete(id, token);
      } catch {}
    }
    productIds = [];
  });

  // --- POSITIVE TESTS ---
  test('Should get all products', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ productService }) => {
    const productBody = generateProductData();
    const createResponse = await productService.create(token, productBody);
    productIds.push(createResponse._id);
    const response = await productService.controller.getSorted(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.some((p) => p.name === productBody.name)).toBeTruthy();
  });

  test('Should search by existing product name', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const productBody = generateProductData();
    const createResponse = await productService.create(token, productBody);
    productIds.push(createResponse._id);
    const allResponse = await productService.controller.getSorted(token);
    const found = allResponse.body.Products.find((p) => p._id === createResponse._id);
    if (!found) throw new Error('Created product not found in all products response');
    const nameToSearch = found.name;
    const response = await productService.controller.getSorted(token, { search: nameToSearch });
    expect(response.body.Products.some((p) => p.name === nameToSearch)).toBeTruthy();
  });

  test('Should filter by manufacturer', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const productBody = generateProductData({ manufacturer: MANUFACTURERS.APPLE });
    const createResponse = await productService.create(token, productBody);
    productIds.push(createResponse._id);
    const response = await productService.controller.getSorted(token, { manufacturer: MANUFACTURERS.APPLE });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.every((p) => p.manufacturer === MANUFACTURERS.APPLE)).toBeTruthy();
  });

  test('Should filter by multiple manufacturers', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const product1 = generateProductData({ manufacturer: MANUFACTURERS.APPLE });
    const product2 = generateProductData({ manufacturer: MANUFACTURERS.SAMSUNG });
    const createResponse1 = await productService.create(token, product1);
    const createResponse2 = await productService.create(token, product2);
    productIds.push(createResponse1._id);
    productIds.push(createResponse2._id);
    const manufacturers = [MANUFACTURERS.APPLE, MANUFACTURERS.SAMSUNG];
    const response = await productService.controller.getSorted(token, { manufacturer: manufacturers } as any);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.some((p) => p.manufacturer === MANUFACTURERS.APPLE)).toBeTruthy();
    expect(response.body.Products.some((p) => p.manufacturer === MANUFACTURERS.SAMSUNG)).toBeTruthy();
  });

  test('Should search by price', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const productBody = generateProductData({ price: 12345 });
    const createResponse = await productService.create(token, productBody);
    productIds.push(createResponse._id);
    const response = await productService.controller.getSorted(token, { search: '12345' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.some((p) => p.price === 12345)).toBeTruthy();
  });

  test('Should sort by name asc', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token, { sortField: 'name', sortOrder: 'asc' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    
    expect(response.body.sorting.sortField).toBe('name');
    expect(response.body.sorting.sortOrder).toBe('asc');
    expect(Array.isArray(response.body.Products)).toBe(true);
  });

  test('Should sort by name desc', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token, { sortField: 'name', sortOrder: 'desc' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    const names = response.body.Products.map(p => p.name);
    const sortedNames = _.sortBy(names).reverse();
    expect(names).toEqual(sortedNames);
  });

  test('Should sort by price', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const prices = [100, 200, 50];
    for (const price of prices) {
      const createResponse = await productService.create(token, generateProductData({ price }));
      productIds.push(createResponse._id);
    }
    const response = await productService.controller.getSorted(token, { sortField: 'price', sortOrder: 'asc' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    const sortedPrices = response.body.Products.map((p) => p.price);
    expect([...sortedPrices].sort((a, b) => a - b)).toEqual(sortedPrices);
  });

  test('Should sort by manufacturer', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const manufacturers = [MANUFACTURERS.APPLE, MANUFACTURERS.SAMSUNG, MANUFACTURERS.GOOGLE];
    for (const manufacturer of manufacturers) {
      const createResponse = await productService.create(token, generateProductData({ manufacturer }));
      productIds.push(createResponse._id);
    }
    const response = await productService.controller.getSorted(token, { sortField: 'manufacturer', sortOrder: 'asc' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    const sortedManufacturers = response.body.Products.map((p) => p.manufacturer);
    expect([...sortedManufacturers].sort()).toEqual(sortedManufacturers);
  });

  test('Should sort by createdOn', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token, { sortField: 'createdOn', sortOrder: 'asc' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    const createdOnArr = response.body.Products.map((p) => p.createdOn);
    expect([...createdOnArr].sort()).toEqual(createdOnArr);
  });

  test('Should have IsSuccess true and ErrorMessage null for success', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
  });

  // --- NEGATIVE TESTS ---
  test('Should return empty array for non-existing product name', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token, { search: 'nonexistentproduct' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.length).toBe(0);
  });

  test('Should return 401 for invalid access token', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted('invalidtoken');
    validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
  });

  test('Should return 401 for missing access token', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted('');
    validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.NOT_AUTHORIZED);
  });

  test('Should return empty array for non-existing product price', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token, { search: '9999999' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.length).toBe(0);
  });

  test('Should return empty array for non-existing product manufacturer', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productService }) => {
    const response = await productService.controller.getSorted(token, { search: 'NonExistentManufacturer' });
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(productsSchema, response.body);
    expect(response.body.Products.length).toBe(0);
  });

}); 